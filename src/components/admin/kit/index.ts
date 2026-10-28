/* The admin kit. FROZEN for the 2026-10-27-admin shards: import from here,
   never copy or restyle. Styles live in ./admin.css, loaded once by the shell. */
export { MoveButtons, Notice, AdminButton, StatusPill, PageHeader, AdminLinkButton, EmptyState, moveId } from "./basics";
export type { ButtonVariant, AdminButtonProps, PillTone } from "./basics";
export { Segmented, fromLocalInput, SlugField, toLocalInput, Checkbox, Select, Field, TextArea, slugError, PriceField, TextInput, DateTimeInput } from "./fields";
export type { FieldProps } from "./fields";
export { DataTable } from "./DataTable";
export type { Column } from "./DataTable";
export { imageError, FileUpload, ImageUpload } from "./uploads";
export type { ImageValue } from "./uploads";
export { useToast, useConfirm, ConfirmDialog, ConfirmProvider, useSaveState, ToastProvider, SaveBar } from "./feedback";
export type { ConfirmOptions, SaveStatus } from "./feedback";
export { Wizard } from "./Wizard";
export type { WizardStep } from "./Wizard";
