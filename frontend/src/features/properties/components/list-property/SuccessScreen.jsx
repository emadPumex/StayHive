import {CheckCircle2} from 'lucide-react';
import {T} from './constants';

const SuccessScreen = () => (
    <div style={{background: T.bg900, minHeight: '100vh'}} className="flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
            <div className="relative inline-flex mb-6">
                <span style={{background: T.lime}} className="absolute inset-0 rounded-full animate-ping opacity-30"
                      aria-hidden="true"/>
                <div style={{background: T.limePale, border: `2px solid ${T.lime}`}}
                     className="w-20 h-20 rounded-full flex items-center justify-center relative">
                    <CheckCircle2 className="w-9 h-9" style={{color: T.lime}} aria-hidden="true"/>
                </div>
            </div>
            <h2 style={{color: T.text}} className="text-3xl font-bold mb-2">Listing submitted!</h2>
            <p style={{color: T.muted}} className="text-sm leading-relaxed">
                Your property is under review. We'll notify you within 24 hours. Redirecting you home…
            </p>
        </div>
    </div>
);

export default SuccessScreen;
