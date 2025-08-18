import Button from '../Button';

const NavigationButtons = ({ 
  currentStep, 
  setCurrentStep, 
  formData, 
  isSubmitting 
}) => {
  const isStep1Valid = formData.fullName && formData.phone && formData.email;
  const isStep2Valid = formData.checkIn && formData.checkOut;

  return (
    <div className="flex justify-between pt-6">
      {currentStep > 1 && (
        <Button 
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          Quay lại
        </Button>
      )}
      
      <div className="ml-auto">
        {currentStep < 3 ? (
          <Button 
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid)
            }
          >
            Tiếp tục
          </Button>
        ) : (
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
