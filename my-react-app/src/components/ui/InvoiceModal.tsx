import React from 'react';
import Modal from './Modal';
import { IndianRupee, Printer, Download, MapPin, Building2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { PayrollRecord, Staff } from '@/types';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: PayrollRecord | null;
    staff: Staff | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, record, staff }) => {
    if (!record || !staff) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Payroll Invoice / Payslip" size="lg">
            <div className="space-y-8 p-4">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-border pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-display font-black tracking-tighter uppercase">Boxway Architecture</h3>
                        </div>
                        <div className="text-[12px] text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>42, Design Square, Bengaluru, KA 560038</span>
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground/80 mt-1">GSTIN: 29AABCX1234K1Z5</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Invoice Number</h4>
                        <p className="text-sm font-bold tabular-nums">INV-{record.year}-{(record.id).slice(-6).toUpperCase()}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{record.month} {record.year}</p>
                    </div>
                </div>

                {/* Staff & Company Info */}
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Bill To:</h4>
                        <div className="space-y-1">
                            <p className="text-[15px] font-bold text-foreground">{staff.name}</p>
                            <p className="text-[12px] text-muted-foreground uppercase">{staff.role}</p>
                            <p className="text-[12px] text-muted-foreground">{staff.email}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Status:</h4>
                        <div className="inline-flex">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${record.status === 'paid' ? 'bg-success/10 text-success' :
                                record.status === 'approved' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                                }`}>
                                {record.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Breakdown Table */}
                <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/60">
                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</th>
                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            <tr>
                                <td className="px-5 py-4">
                                    <p className="text-[13px] font-bold text-foreground">Base Salary</p>
                                    <p className="text-[11px] text-muted-foreground">Standard monthly compensation</p>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <span className="text-[13px] font-bold tabular-nums">{formatCurrency(record.baseSalary)}</span>
                                </td>
                            </tr>
                            {record.bonus > 0 && (
                                <tr className="text-success">
                                    <td className="px-5 py-4">
                                        <p className="text-[13px] font-bold">Performance Bonus</p>
                                        <p className="text-[11px] opacity-80">Additional project completion incentives</p>
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold tabular-nums">
                                        +{formatCurrency(record.bonus)}
                                    </td>
                                </tr>
                            )}
                            {record.deductions > 0 && (
                                <tr className="text-destructive">
                                    <td className="px-5 py-4">
                                        <p className="text-[13px] font-bold">Deductions</p>
                                        <p className="text-[11px] opacity-80">Leaves: {record.totalDays - record.attendance} days missed</p>
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold tabular-nums">
                                        -{formatCurrency(record.deductions)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-foreground text-background">
                                <td className="px-5 py-4">
                                    <p className="text-[12px] font-bold uppercase tracking-widest">Net Payable</p>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-lg font-black tracking-tighter">
                                        <IndianRupee className="w-4 h-4" />
                                        <span className="tabular-nums">{formatCurrency(record.netSalary).replace('₹', '')}</span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-border">
                    <p className="text-[10px] text-muted-foreground max-w-[200px]">
                        This is a computer-generated document. No signature is required.
                    </p>
                    <div className="flex gap-2 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-[11px] font-bold uppercase tracking-wider hover:bg-border transition-colors"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity underline-offset-4 decoration-primary decoration-2"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
