'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types/card';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (front: string, back: string) => Promise<void>;
}

export default function AddCardModal({ isOpen, onClose, onSubmit }: AddCardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      alert('Both front and back content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(front.trim(), back.trim());
      // Reset form
      setFront('');
      setBack('');
      setActiveTab('front');
      onClose();
    } catch (error) {
      console.error('Failed to add card:', error);
      alert('Failed to add card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (front.trim() || back.trim()) {
      if (!confirm('Discard changes?')) {
        return;
      }
    }
    setFront('');
    setBack('');
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212121', margin: 0 }}>
              Add New Card
            </h2>
            <button
              onClick={handleClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#666',
                cursor: 'pointer',
                padding: '0.25rem',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #e0e0e0',
                padding: '0 1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('front')}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'front' ? '2px solid #1976d2' : '2px solid transparent',
                  color: activeTab === 'front' ? '#1976d2' : '#666',
                  fontWeight: activeTab === 'front' ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
              >
                Front (Question)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('back')}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'back' ? '2px solid #1976d2' : '2px solid transparent',
                  color: activeTab === 'back' ? '#1976d2' : '#666',
                  fontWeight: activeTab === 'back' ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
              >
                Back (Answer)
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
              {activeTab === 'front' ? (
                <div>
                  <label
                    htmlFor="front"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#212121',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Front (Question) <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <textarea
                    id="front"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter question or prompt (Markdown supported)"
                    required
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                    Supports Markdown: **bold**, *italic*, `code`, ```code blocks```, lists, etc.
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="back"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#212121',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Back (Answer) <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <textarea
                    id="back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter answer or explanation (Markdown supported)"
                    required
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                    Supports Markdown: **bold**, *italic*, `code`, ```code blocks```, lists, etc.
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
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#fff',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !front.trim() || !back.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isSubmitting || !front.trim() || !back.trim() ? '#ccc' : '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isSubmitting || !front.trim() || !back.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && front.trim() && back.trim()) {
                    e.currentTarget.style.backgroundColor = '#1565c0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && front.trim() && back.trim()) {
                    e.currentTarget.style.backgroundColor = '#1976d2';
                  }
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Card'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
