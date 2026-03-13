import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
			<div className="max-w-xl w-full text-center">
		
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 200, damping: 15 }}
					className="inline-flex items-center justify-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
					<AlertTriangle className="w-16 h-16 text-red-400" />
				</motion.div>

			
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="text-6xl font-light text-white mb-4">
					404
				</motion.h1>

				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-2xl font-medium text-white mb-3">
					Page Not Found
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-zinc-500 mb-10">
					The page you're looking for doesn’t exist or has been moved.
				</motion.p>

		
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex items-center justify-center gap-4 flex-wrap">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition">
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</button>

					<button
						onClick={() => navigate('/')}
						className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/20 transition">
						<Home className="w-4 h-4" />
						Go Home
					</button>
				</motion.div>
			</div>
		</div>
	);
};

export default NotFound;
