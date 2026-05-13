const PaidGenerationLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-lg font-medium">더 깊은 흐름을 열고 있어...</p>
          <p className="text-white/70 text-sm">곧 보여줄게</p>
        </div>
      </div>
    </div>
  );
};

export default PaidGenerationLoading;
