
"use client";

import { useParams } from 'next/navigation';
import { packages } from '@/lib/data';
import { PackageForm } from '../../../package-form';

export default function EditPackagePage() {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const existingPackage = packages.find(p => p.id === id);

    if (!existingPackage) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Package not found.</p>
            </div>
        )
    }

    return <PackageForm existingPackage={existingPackage} />;
}
