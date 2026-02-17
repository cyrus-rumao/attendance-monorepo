import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	AlertTriangle,
	Lock,
	Mail,
	X,
	Trash2,
	Eye,
	EyeOff,
	Edit,
	Save,
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginInput } from '../schemas/user.schema';

type ActionType = 'delete' | 'edit';

interface EditFormData {
	name: string;
	code: string;
	type: 'lecture' | 'lab';
}

interface ActionConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (editData?: EditFormData) => Promise<void>;
	action: ActionType;
	subjectName: string;
	subjectCode: string;
	subjectType: 'lecture' | 'lab';
	loading: boolean;
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	action,
	subjectName,
	subjectCode,
	subjectType,
	loading,
}) => {
	const { login } = useAuthStore();
	const [step, setStep] = useState<'warning' | 'auth'>('warning');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [verifying, setVerifying] = useState(false);

	// Edit form state
	const [editData, setEditData] = useState<EditFormData>({
		name: subjectName,
		code: subjectCode,
		type: subjectType,
	});

	const isDelete = action === 'delete';
	const isEdit = action === 'edit';

	const handleClose = () => {
		if (!loading && !verifying) {
			setStep('warning');
			setEmail('');
			setPassword('');
			setError('');
			setShowPassword(false);
			// Reset edit data
			setEditData({
				name: subjectName,
				code: subjectCode,
				type: subjectType,
			});
			onClose();
		}
	};

	const handleProceedToAuth = () => {
		// Validate edit form if editing
		if (isEdit) {
			if (!editData.name.trim() || !editData.code.trim()) {
				setError('Please fill in all fields');
				return;
			}
		}
		setError('');
		setStep('auth');
	};

	const handleConfirmAction = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Please enter both email and password');
			return;
		}

		try {
			setVerifying(true);

			// Verify credentials using auth store
			const loginData: LoginInput = { email, password };
			const success = await login(loginData);

			if (!success) {
				setError('Invalid email or password');
				setVerifying(false);
				return;
			}

			// Credentials verified, proceed with action
			if (isEdit) {
				await onConfirm(editData);
			} else {
				await onConfirm();
			}

			// Close modal on success
			handleClose();
		} catch (err: any) {
			setError('Verification failed. Please try again.');
			setVerifying(false);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
							{step === 'warning' ? (
								// Warning/Edit Step
								<div className="p-6">
									{/* Header */}
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-3">
											<div
												className={`p-3 rounded-xl border ${
													isDelete
														? 'bg-red-500/10 border-red-500/20'
														: 'bg-amber-500/10 border-amber-500/20'
												}`}>
												{isDelete ? (
													<AlertTriangle className="w-6 h-6 text-red-400" />
												) : (
													<Edit className="w-6 h-6 text-amber-400" />
												)}
											</div>
											<div>
												<h2 className="text-xl font-medium text-white">
													{isDelete ? 'Delete Subject' : 'Edit Subject'}
												</h2>
												<p className="text-sm text-zinc-500 mt-1">
													{isDelete
														? 'This action cannot be undone'
														: 'Update subject details'}
												</p>
											</div>
										</div>
										<button
											onClick={handleClose}
											disabled={loading}
											className="p-2 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50">
											<X className="w-5 h-5 text-zinc-400" />
										</button>
									</div>

									{/* Content */}
									{isDelete ? (
										// Delete Warning
										<div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
											<p className="text-white font-medium mb-2">
												You are about to delete:
											</p>
											<p className="text-amber-400 font-mono text-lg mb-3">
												{subjectName}
											</p>
											<div className="space-y-2 text-sm text-zinc-400">
												<p className="flex items-start gap-2">
													<span className="text-red-400 mt-1">•</span>
													<span>
														All attendance records for this subject will be
														permanently deleted
													</span>
												</p>
												<p className="flex items-start gap-2">
													<span className="text-red-400 mt-1">•</span>
													<span>
														This subject will be removed from your timetable
													</span>
												</p>
												<p className="flex items-start gap-2">
													<span className="text-red-400 mt-1">•</span>
													<span>All analytics and statistics will be lost</span>
												</p>
											</div>
										</div>
									) : (
										// Edit Form
										<div className="space-y-4 mb-6">
											{/* Error in form */}
											{error && (
												<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
													<AlertTriangle className="w-4 h-4 text-red-400" />
													<p className="text-sm text-red-400">{error}</p>
												</div>
											)}

											{/* Subject Name */}
											<div>
												<label
													htmlFor="subject-name"
													className="block text-sm font-medium text-zinc-400 mb-2">
													Subject Name
												</label>
												<input
													type="text"
													id="subject-name"
													value={editData.name}
													onChange={(e) =>
														setEditData({ ...editData, name: e.target.value })
													}
													className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
													placeholder="e.g., Data Structures"
												/>
											</div>

											{/* Subject Code */}
											<div>
												<label
													htmlFor="subject-code"
													className="block text-sm font-medium text-zinc-400 mb-2">
													Subject Code
												</label>
												<input
													type="text"
													id="subject-code"
													value={editData.code}
													onChange={(e) =>
														setEditData({
															...editData,
															code: e.target.value.toUpperCase(),
														})
													}
													className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition uppercase"
													placeholder="e.g., DS"
												/>
											</div>

											{/* Subject Type */}
											<div>
												<label className="block text-sm font-medium text-zinc-400 mb-3">
													Subject Type
												</label>
												<div className="grid grid-cols-2 gap-3">
													<button
														type="button"
														onClick={() =>
															setEditData({ ...editData, type: 'lecture' })
														}
														className={`p-4 rounded-lg border-2 transition ${
															editData.type === 'lecture'
																? 'bg-amber-500/10 border-amber-500 text-amber-400'
																: 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-amber-500/50'
														}`}>
														<div className="text-sm font-medium">Lecture</div>
													</button>
													<button
														type="button"
														onClick={() =>
															setEditData({ ...editData, type: 'lab' })
														}
														className={`p-4 rounded-lg border-2 transition ${
															editData.type === 'lab'
																? 'bg-purple-500/10 border-purple-500 text-purple-400'
																: 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-purple-500/50'
														}`}>
														<div className="text-sm font-medium">Lab</div>
													</button>
												</div>
											</div>
										</div>
									)}

									{/* Actions */}
									<div className="flex gap-3">
										<button
											onClick={handleClose}
											disabled={loading}
											className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50">
											Cancel
										</button>
										<button
											onClick={handleProceedToAuth}
											disabled={loading}
											className={`flex-1 px-4 py-3 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 ${
												isDelete
													? 'bg-red-500 hover:bg-red-600'
													: 'bg-amber-500 hover:bg-amber-600'
											}`}>
											{isDelete ? (
												<>
													<Trash2 className="w-4 h-4" />
													Continue
												</>
											) : (
												<>
													<Save className="w-4 h-4" />
													Save Changes
												</>
											)}
										</button>
									</div>
								</div>
							) : (
								// Auth Step
								<div className="p-6">
									{/* Header */}
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-3">
											<div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
												<Lock className="w-6 h-6 text-amber-400" />
											</div>
											<div>
												<h2 className="text-xl font-medium text-white">
													Verify Your Identity
												</h2>
												<p className="text-sm text-zinc-500 mt-1">
													Enter your credentials to confirm
												</p>
											</div>
										</div>
										<button
											onClick={handleClose}
											disabled={loading || verifying}
											className="p-2 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50">
											<X className="w-5 h-5 text-zinc-400" />
										</button>
									</div>

									{/* Error Message */}
									<AnimatePresence>
										{error && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
												<AlertTriangle className="w-4 h-4 text-red-400" />
												<p className="text-sm text-red-400">{error}</p>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Auth Form */}
									<form
										onSubmit={handleConfirmAction}
										className="space-y-4">
										{/* Email */}
										<div className="relative">
											<label
												htmlFor="auth-email"
												className="block text-sm font-medium text-zinc-400 mb-2">
												Email
											</label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
												<input
													type="email"
													id="auth-email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													disabled={loading || verifying}
													required
													className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition disabled:opacity-50"
													placeholder="your.email@example.com"
												/>
											</div>
										</div>

										{/* Password */}
										<div className="relative">
											<label
												htmlFor="auth-password"
												className="block text-sm font-medium text-zinc-400 mb-2">
												Password
											</label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
												<input
													type={showPassword ? 'text' : 'password'}
													id="auth-password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													disabled={loading || verifying}
													required
													className="w-full pl-10 pr-12 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition disabled:opacity-50"
													placeholder="Enter your password"
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													disabled={loading || verifying}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition disabled:opacity-50">
													{showPassword ? (
														<Eye className="w-5 h-5" />
													) : (
														<EyeOff className="w-5 h-5" />
													)}
												</button>
											</div>
										</div>

										{/* Info */}
										<div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
											<p className="text-xs text-zinc-400">
												For security reasons, you must verify your identity
												before{' '}
												{isDelete
													? 'deleting a subject and all its associated data'
													: 'updating subject information'}
												.
											</p>
										</div>

										{/* Actions */}
										<div className="flex gap-3 pt-2">
											<button
												type="button"
												onClick={() => {
													setStep('warning');
													setError('');
												}}
												disabled={loading || verifying}
												className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50">
												Back
											</button>
											<button
												type="submit"
												disabled={loading || verifying}
												className={`flex-1 px-4 py-3 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 ${
													isDelete
														? 'bg-red-500 hover:bg-red-600'
														: 'bg-amber-500 hover:bg-amber-600'
												}`}>
												{verifying || loading ? (
													<>
														<motion.div
															animate={{ rotate: 360 }}
															transition={{
																duration: 1,
																repeat: Infinity,
																ease: 'linear',
															}}
															className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
														/>
														<span>
															{verifying
																? 'Verifying...'
																: isDelete
																	? 'Deleting...'
																	: 'Saving...'}
														</span>
													</>
												) : (
													<>
														{isDelete ? (
															<>
																<Trash2 className="w-4 h-4" />
																<span>Delete Subject</span>
															</>
														) : (
															<>
																<Save className="w-4 h-4" />
																<span>Save Changes</span>
															</>
														)}
													</>
												)}
											</button>
										</div>
									</form>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ActionConfirmationModal;
