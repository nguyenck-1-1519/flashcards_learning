'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types/card';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardId: string, front: string, back: string) => Promise<void>;
  card: Card;
}

export default function EditCardModal({ isOpen, onClose, onSubmit, card }: EditCardModalProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');

  // Reset form when card changes
  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
    setActiveTab('front');
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      alert('Both front and back content are required');
      return;
    }

    if (front.length > 10000 || back.length > 10000) {
      alert('Content cannot exceed 10,000 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(card.id, front.trim(), back.trim());
      onClose();
    } catch (error) {
      console.error('Failed to update card:', error);
      alert('Failed to update card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Check if content has changed
    if (front.trim() !== card.front.trim() || back.trim() !== card.back.trim()) {
      if (!confirm('Discard changes?')) {
        return;
      }
    }
    setFront(card.front);
    setBack(card.back);
    setActiveTab('front');
    onClose();
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
        onClick={handleClose}
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
            maxWidth: '800px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#212121' }}>
              Edit Card
            </h2>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('front')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'front' ? '#fff' : 'transparent',
                borderBottom: activeTab === 'front' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === 'front' ? 600 : 400,
                color: activeTab === 'front' ? '#1976d2' : '#666',
                transition: 'all 0.2s',
              }}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('back')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'back' ? '#fff' : 'transparent',
                borderBottom: activeTab === 'back' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === 'back' ? 600 : 400,
                color: activeTab === 'back' ? '#1976d2' : '#666',
                transition: 'all 0.2s',
              }}
            >
              Back
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Content Area */}
            <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
              {activeTab === 'front' ? (
                <div>
                  <label
                    htmlFor="front"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#666',
                    }}
                  >
                    Front (Question/Prompt) - Markdown supported
                  </label>
                  <textarea
                    id="front"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter the question or prompt..."
                    required
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '1rem',
                      fontSize: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                    maxLength={10000}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666', textAlign: 'right' }}>
                    {front.length} / 10,000 characters
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="back"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#666',
                    }}
                  >
                    Back (Answer) - Markdown supported
                  </label>
                  <textarea
                    id="back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter the answer..."
                    required
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '1rem',
                      fontSize: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                    maxLength={10000}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666', textAlign: 'right' }}>
                    {back.length} / 10,000 characters
                  </div>
                </div>
              )}
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
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#666',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !front.trim() || !back.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSubmitting || !front.trim() || !back.trim() ? '#ccc' : '#1976d2',
                  color: '#fff',
                  cursor: isSubmitting || !front.trim() || !back.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
