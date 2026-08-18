export function PorketoBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src="/porketo.png"
        alt=""
        className="absolute -right-16 top-[-4rem] h-[28rem] w-[28rem] object-contain opacity-[0.16] blur-3xl sm:h-[36rem] sm:w-[36rem]"
      />
      <img
        src="/porketo-mark.png"
        alt=""
        className="absolute -bottom-10 -left-8 h-56 w-56 object-contain opacity-[0.1] blur-2xl"
      />
    </div>
  );
}
