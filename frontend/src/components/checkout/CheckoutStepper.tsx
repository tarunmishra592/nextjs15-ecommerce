import { useAppSelector } from '@/store/store';
import { selectCheckoutStep } from '@/store/slices/checkoutSlice';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

const STEPS = [
  { id: 'address', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
] as const;

export const CheckoutStepper = () => {
  const currentStep = useAppSelector(selectCheckoutStep);
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-green-600 -translate-y-1/2 z-10 transition-all duration-300"
          style={{
            width: `${((STEPS.findIndex(s => s.id === currentStep) + 1) / STEPS.length) * 100}%`
          }}
        />
        
        {STEPS.map((step, index) => {
          const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center z-20">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                isCompleted || isCurrent 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-600",
                isCurrent ? "ring-4 ring-green-200" : ""
              )}>
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn(
                "text-sm font-medium",
                isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={className}
  >
    <path 
      fillRule="evenodd" 
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
);