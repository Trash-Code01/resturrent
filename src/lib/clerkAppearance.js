export const clerkAppearance = {
  variables: {
    colorPrimary: '#d4af37',
    colorBackground: '#0c0c0a',
    colorInputBackground: 'rgba(255,255,255,0.03)',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#a3a3a3',
    colorTextOnPrimaryBackground: '#000000',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    borderRadius: '18px',
    fontFamily: '"Inter", "system-ui", sans-serif',
  },
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'iconButton',
    logoImageUrl: '',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full',
    card: 'w-full rounded-[26px] border !border-white/10 !bg-[#0c0c0a] p-8 sm:p-10 shadow-[0_28px_80px_rgba(0,0,0,0.5)]',
    headerTitle: '!font-sans !text-[2rem] !font-semibold tracking-tight !text-white text-center mb-2',
    headerSubtitle: '!text-white/60 text-sm text-center mb-6 tracking-normal leading-6',
    socialButtonsBlockButton: 'border !border-white/10 !bg-[#0c0c0a] !text-white hover:!bg-white/5 transition-colors rounded-[16px] h-12',
    socialButtonsBlockButtonText: 'font-medium tracking-normal text-sm',
    formFieldLabel: 'uppercase tracking-[0.12em] text-[10px] !text-[#d4af37] mb-2 font-semibold',
    formFieldInput: 'border !border-white/10 !bg-white/5 !text-white placeholder:!text-white/30 focus:!border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/35 transition-all rounded-[16px] h-12 px-4',
    formButtonPrimary: '!bg-[#d4af37] !text-black hover:!bg-[#e5c558] transition-colors rounded-[16px] h-12 uppercase tracking-[0.18em] text-[11px] font-bold mt-4',
    footerActionText: '!text-white/50 text-sm',
    footerActionLink: '!text-[#d4af37] hover:!text-white transition-colors font-semibold text-sm',
    dividerLine: '!bg-white/10',
    dividerText: '!text-white/40 uppercase tracking-[0.2em] text-[10px]',
    identityPreviewText: '!text-white',
    identityPreviewEditButton: '!text-[#d4af37] hover:!text-white transition-colors',
    formFieldSuccessText: '!text-[#d4af37]',
    formFieldErrorText: '!text-red-400',
    header: 'w-full',
    formFieldInputShowPasswordButton: '!text-white/40 hover:!text-white transition-colors',
  },
};

export const clerkModalAppearance = {
  ...clerkAppearance,
  variables: {
    ...clerkAppearance.variables,
    borderRadius: '20px',
  },
  elements: {
    ...clerkAppearance.elements,
    card: 'w-full rounded-[26px] border !border-[#d4af37]/20 !bg-[#0c0c0a] p-8 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]',
    modalBackdrop:
      'bg-black/80 backdrop-blur-[2px]',
    headerTitle:
      '!text-center !text-white !text-[2rem] !leading-none !font-sans !font-semibold tracking-tight',
    headerSubtitle:
      '!text-center !text-white/60 text-sm leading-6 mt-2',
    socialButtonsBlockButton:
      'rounded-[16px] border !border-white/10 !bg-white/5 !text-white hover:!bg-white/10 transition-colors h-12',
    socialButtonsBlockButtonText: 'font-medium text-sm tracking-normal',
    formFieldLabel:
      'text-[11px] !font-medium !text-[#d4af37] mb-2 tracking-normal uppercase',
    formFieldInput:
      'rounded-[16px] border !border-white/10 !bg-white/5 !text-white placeholder:!text-white/30 focus:!border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/30 transition-all h-12 px-4',
    formButtonPrimary:
      '!rounded-[16px] !bg-[#d4af37] !text-black hover:!bg-[#e5c558] transition-colors h-12 text-sm font-semibold tracking-wide mt-4',
    footerActionText: '!text-white/50 text-sm',
    footerActionLink: '!text-[#d4af37] hover:!text-white transition-colors font-medium text-sm',
    dividerLine: '!bg-white/10',
    dividerText: '!text-white/40 uppercase tracking-[0.16em] text-[10px]',
    formResendCodeLink: '!text-[#d4af37] hover:!text-white',
    otpCodeFieldInput:
      '!rounded-[16px] !border-white/10 !bg-white/5 !text-white',
    identityPreviewText: '!text-white',
    identityPreviewEditButton: '!text-[#d4af37]',
    modalCloseButton:
      '!rounded-full !bg-white/[0.04] !text-white/40 hover:!bg-white/[0.08] hover:!text-white',
  },
};

export const clerkRouteAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    card: 'w-full rounded-[22px] border !border-[#d4af37]/20 !bg-black/60 backdrop-blur-xl p-7 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.8)]',
    header: '!hidden',
    headerTitle: '!hidden',
    headerSubtitle: '!hidden',
    socialButtonsBlockButton:
      'rounded-[16px] border !border-white/10 !bg-white/5 !text-white hover:!bg-white/10 transition-colors h-12',
    formButtonPrimary:
      '!rounded-[16px] !bg-[#d4af37] !text-black hover:!bg-[#e4c24f] transition-colors h-12 text-sm font-semibold tracking-[0.16em] mt-4 uppercase',
    footerActionText: '!text-white/50 text-sm',
    footerActionLink:
      '!text-[#d4af37] hover:!text-white transition-colors font-medium text-sm',
  },
};

export const clerkSplitAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    rootBox: '!w-full !max-w-full !min-w-0',
    cardBox: '!w-full !max-w-full !min-w-0',
    card: '!bg-transparent !shadow-none p-0 !border-none !w-full !max-w-full !min-w-0',
    headerTitle: '!hidden',
    headerSubtitle: '!hidden',
    socialButtonsBlockButton: 'border !border-white/10 !bg-white/5 !text-white hover:!bg-white/10 transition-colors rounded-none h-14',
    socialButtonsBlockButtonText: 'font-sans font-medium tracking-wide text-sm',
    formFieldLabel: 'uppercase tracking-[0.15em] text-[10px] !text-[#d4af37] mb-3 font-semibold',
    formFieldInput: 'border !border-white/10 !bg-white/5 !text-white placeholder:!text-white/30 focus:!border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all rounded-none h-14 px-4 text-base',
    formButtonPrimary: '!bg-[#d4af37] !text-black hover:!bg-[#e5c558] transition-colors rounded-none h-14 uppercase tracking-[0.2em] text-[11px] font-bold mt-6',
    footerActionText: '!text-white/40 text-sm',
    footerActionLink: '!text-[#d4af37] hover:!text-white transition-colors font-medium text-sm',
    dividerLine: '!bg-white/10',
    dividerText: '!text-white/30 uppercase tracking-[0.2em] text-[10px]',
    identityPreviewText: '!text-white text-base',
    identityPreviewEditButton: '!text-[#d4af37] hover:!text-white transition-colors',
    formFieldInputShowPasswordButton: '!text-white/40 hover:!text-white transition-colors',
    header: 'w-full !text-left items-start',
    footer: '!bg-transparent',
    internal: '!bg-transparent',
  },
};
