// import { Button as HeroButton, type ButtonProps } from "@heroui/react";
// import { buttonVariants, tv, type VariantProps } from "@heroui/styles";

// const customButtonVariants = tv({
//   extend: buttonVariants,
//   base: "font-medium transition-all",
//   variants: {
//     intent: {
//       primary: "bg-blue-500 hover:bg-blue-600 text-white",
//       secondary: "bg-gray-200 hover:bg-gray-300",
//       danger: "hover:bg-red-600 text-white",
//     },
//     variant: {
//       outline: "border-red",
//       primary: "bg-red-400",
//     },
//     size: {
//       small: "text-sm px-2 py-1",
//       medium: "text-base px-4 py-2",
//       large: "text-lg px-6 py-3",
//     },
//   },
//   defaultVariants: {
//     intent: "primary",
//     size: "medium",
//   },
// });

// type CustomButtonVariants = VariantProps<typeof customButtonVariants>;

// interface CustomButtonProps
//   extends Omit<ButtonProps, "className" | "size">, CustomButtonVariants {
//   className?: string;
// }

// export function CustomButton({
//   intent,
//   size,
//   className,
//   ...props
// }: CustomButtonProps) {
//   return (
//     <HeroButton
//       className={customButtonVariants({ intent, size, className })}
//       {...props}
//     />
//   );
// }
