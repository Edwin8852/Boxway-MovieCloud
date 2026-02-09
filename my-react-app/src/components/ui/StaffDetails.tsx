import React from 'react';
import type { Staff } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import {
    User, Mail, Phone, Calendar, Briefcase,
    MapPin, GraduationCap, Heart
} from 'lucide-react';

interface StaffDetailsProps {
    staff: Staff;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ staff }) => {
    const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">{label}</p>
                <p className="text-sm font-semibold truncate text-foreground">{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Profile Section */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/60">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
                    {staff.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">{staff.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {staff.role}
                        </span>
                        <span className="text-xs text-muted-foreground">ID: {staff.id.slice(-6).toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Info */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Contact Details</h4>
                    <DetailItem icon={Mail} label="Email Address" value={staff.email} />
                    <DetailItem icon={Phone} label="Primary Contact" value={staff.phone} />
                    <DetailItem icon={MapPin} label="Location / Pincode" value={staff.pincode ? `Pincode: ${staff.pincode}` : 'N/A'} />
                </div>

                {/* Professional Info */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Professional Info</h4>
                    <DetailItem icon={Calendar} label="Joining Date" value={staff.joiningDate} />
                    <DetailItem icon={Briefcase} label="Current Salary" value={formatCurrency(staff.salary)} />
                    <DetailItem icon={GraduationCap} label="Qualification" value={staff.qualification || 'N/A'} />
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Personal Profile</h4>
                    <DetailItem icon={User} label="Gender" value={staff.gender || 'N/A'} />
                    <DetailItem icon={Calendar} label="Date of Birth" value={staff.dob ? new Date(staff.dob).toLocaleDateString() : 'N/A'} />
                    <DetailItem icon={Heart} label="Blood Group" value={staff.bloodGroup || 'N/A'} />
                </div>

                {/* Financial Info */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Financial / Bank</h4>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Bank</span>
                            <span className="font-bold text-foreground">{staff.bankDetails?.bankName || 'HDFC Bank'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Account</span>
                            <span className="font-mono font-bold text-foreground">••••{staff.bankDetails?.accountNumber?.slice(-4) || '4321'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">IFSC</span>
                            <span className="font-mono font-bold text-foreground">{staff.bankDetails?.ifscCode || 'HDFC0001234'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Emergency Contact</p>
                        <p className="text-sm font-bold text-foreground">{staff.emergencyContact || '+91 98765 43210'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetails;
