'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SessionStats {
  total: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
  duration: number; // in seconds
}

interface SessionSummaryProps {
  deckId: string;
  deckName: string;
  stats: SessionStats;
}

export default function SessionSummary({ deckId, deckName, stats }: SessionSummaryProps) {
  // Calculate accuracy (Good + Easy) / Total
  const accuracy = stats.total > 0 
    ? Math.round(((stats.good + stats.easy) / stats.total) * 100)
    : 0;

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Get congratulatory message based on performance
  const getCongratulatoryMessage = (): string => {
    if (accuracy >= 90) {
      return '🎉 Outstanding! You\'re mastering this deck!';
    } else if (accuracy >= 75) {
      return '👏 Great work! Keep it up!';
    } else if (accuracy >= 60) {
      return '💪 Good effort! You\'re making progress!';
    } else {
      return '📚 Keep practicing! Every review helps!';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
            >
              <span className="text-4xl">✨</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-center mb-2">Session Complete!</h1>
            <p className="text-indigo-100 text-center">{deckName}</p>
          </div>

          {/* Congratulatory Message */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-center text-lg font-medium text-gray-800">
              {getCongratulatoryMessage()}
            </p>
          </div>

          {/* Statistics */}
          <div className="p-6 space-y-4">
            {/* Accuracy */}
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-1">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>

            {/* Cards Studied */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Cards Studied</span>
              <span className="font-semibold text-gray-900">{stats.total}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Time Spent</span>
              <span className="font-semibold text-gray-900">{formatDuration(stats.duration)}</span>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown</div>
              
              {/* Again */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">Again</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.again}</span>
              </div>

              {/* Hard */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Hard</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.hard}</span>
              </div>

              {/* Good */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Good</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.good}</span>
              </div>

              {/* Easy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">Easy</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.easy}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 space-y-3">
            <Link
              href={`/decks/${deckId}`}
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Return to Deck
            </Link>
            <Link
              href="/dashboard"
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center border border-gray-300 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
