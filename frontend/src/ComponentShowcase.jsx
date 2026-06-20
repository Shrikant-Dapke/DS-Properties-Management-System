/**
 * Component Showcase — Visual verification of all design system components
 *
 * This file will be removed once the actual pages are built.
 */

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Download } from 'lucide-react';
import Button from './components/common/Button';
import Input from './components/common/Input';
import Select from './components/common/Select';
import Card from './components/common/Card';
import Badge from './components/common/Badge';
import LoadingSpinner from './components/common/LoadingSpinner';
import { SkeletonCard, SkeletonRow } from './components/common/SkeletonLoader';
import EmptyState from './components/common/EmptyState';
import Modal from './components/common/Modal';
import ConfirmDialog from './components/common/ConfirmDialog';
import { useToast } from './hooks/useToast';
import { formatCurrency, formatDate } from './utils/formatters';

export default function ComponentShowcase() {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-white text-2xl font-bold mb-4 shadow-card">
            DSP
          </div>
          <h1 className="text-3xl font-bold text-primary">DS Properties</h1>
          <p className="text-text-muted mt-1">Design System Component Showcase</p>
        </div>

        {/* Formatters */}
        <Card header="💰 Formatters">
          <div className="space-y-2 text-sm">
            <p><strong>formatCurrency(1500000.50):</strong> {formatCurrency(1500000.50)}</p>
            <p><strong>formatCurrency(25000):</strong> {formatCurrency(25000)}</p>
            <p><strong>formatDate('2026-06-19'):</strong> {formatDate('2026-06-19')}</p>
            <p><strong>formatDate('2026-06-19', 'long'):</strong> {formatDate('2026-06-19', 'long')}</p>
          </div>
        </Card>

        {/* Buttons */}
        <Card header="🔘 Buttons">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="success" icon={Plus}>Success</Button>
              <Button variant="danger" icon={Trash2}>Danger</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="outline" icon={Pencil}>Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
              <Button variant="success" icon={Download} iconPosition="right">Export</Button>
            </div>
          </div>
        </Card>

        {/* Inputs */}
        <Card header="📝 Inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Username" required />
            <Input label="Password" type="password" required />
            <Input label="Amount (₹)" type="number" />
            <Input label="Transaction Date" type="date" />
            <Input label="With Error" error="This field is required" />
            <Input label="Disabled Field" disabled value="Cannot edit" />
          </div>
        </Card>

        {/* Select */}
        <Card header="📋 Select">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payment Mode"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'upi', label: 'UPI' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
              ]}
              required
            />
            <Select
              label="Category"
              value=""
              options={[
                { value: 'road', label: 'Road Construction' },
                { value: 'gutter', label: 'Gutter & Drainage' },
                { value: 'labor', label: 'Labor Charges' },
              ]}
              error="Please select a category"
            />
          </div>
        </Card>

        {/* Badges */}
        <Card header="🏷️ Badges">
          <div className="flex flex-wrap gap-3">
            <Badge variant="intake" dot>Intake</Badge>
            <Badge variant="outtake" dot>Outtake</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success" size="sm">Small</Badge>
            <Badge variant="danger" size="lg">Large</Badge>
          </div>
        </Card>

        {/* Loading States */}
        <Card header="⏳ Loading States">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="md" label="Loading..." />
            </div>
            <h4 className="text-sm font-medium text-text-muted">Skeleton Cards:</h4>
            <div className="grid grid-cols-3 gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <h4 className="text-sm font-medium text-text-muted">Skeleton Rows:</h4>
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </Card>

        {/* Empty State */}
        <Card header="📭 Empty State">
          <EmptyState
            icon={Search}
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction to get started."
            actionLabel="Add Transaction"
            onAction={() => toast.info('Add transaction clicked!')}
          />
        </Card>

        {/* Modal & Toast Triggers */}
        <Card header="🪟 Modals & Toasts">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Open Modal
            </Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>
              Confirm Dialog
            </Button>
            <Button variant="success" onClick={() => toast.success('Transaction saved successfully!')}>
              Success Toast
            </Button>
            <Button variant="danger" onClick={() => toast.error('Failed to save transaction')}>
              Error Toast
            </Button>
            <Button variant="warning" onClick={() => toast.warning('Large amount detected: ₹15,00,000')}>
              Warning Toast
            </Button>
            <Button variant="outline" onClick={() => toast.info('Session will expire in 10 minutes')}>
              Info Toast
            </Button>
          </div>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add New Transaction"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { setShowModal(false); toast.success('Saved!'); }}>
                Save Transaction
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Amount" type="number" required />
            <Input label="Description" />
            <Select
              label="Payment Mode"
              value=""
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'upi', label: 'UPI' },
              ]}
            />
          </div>
        </Modal>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => { setShowConfirm(false); toast.success('Deleted!'); }}
          title="Delete Transaction?"
          message="This will soft-delete the transaction. It can be recovered by an administrator."
          confirmLabel="Delete"
        />

        {/* Footer */}
        <p className="text-center text-text-light text-xs pb-8">
          ✅ All components verified • DS Properties Financial Tracking System
        </p>
      </div>
    </div>
  );
}
