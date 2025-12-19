'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types/card';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  card: Card;
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, card }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
      alert('Failed to delete card. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              ⚠️ Delete Card?
            </h2>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem' }}>
            <p style={{ 
              margin: '0 0 1rem 0', 
              color: '#666',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}>
              This action cannot be undone. The card will be permanently deleted.
            </p>

            {/* Card Preview */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                marginBottom: '1rem',
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#666',
                    marginBottom: '0.25rem',
                  }}
                >
                  FRONT
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#212121',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                  }}
                >
                  {card.front.length > 100 ? `${card.front.substring(0, 100)}...` : card.front}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#666',
                    marginBottom: '0.25rem',
                  }}
                >
                  BACK
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#212121',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                  }}
                >
                  {card.back.length > 100 ? `${card.back.substring(0, 100)}...` : card.back}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              backgroundColor: '#f9f9f9',
            }}
          >
            <button
              onClick={onClose}
              disabled={isDeleting}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#666',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isDeleting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                backgroundColor: isDeleting ? '#ccc' : '#d32f2f',
                color: '#fff',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Card'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
