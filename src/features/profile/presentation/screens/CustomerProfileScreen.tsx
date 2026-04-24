"use client";

import { Link } from "@/i18n/routing";
import { useMemo, useState } from "react";
import {
  Bell,
  IdCard,
  KeyRound,
  Mail,
  MapPinned,
  PencilLine,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatEnumLabel } from "@/utils/formatters";
import type { AddressBookDraftInput } from "@/features/profile/domain/types/profile.types";
import {
  createEmptyAddressDraft,
  useCustomerProfileSettings,
  validateAddressDraft,
} from "@/features/profile/presentation/hooks/useCustomerProfileSettings";

type ProfileScreenCopy = ReturnType<typeof useI18nCopy>["profileScreenCopy"];

function getProfileLoadErrorMessage(
  error: unknown,
  profileScreenCopy: ProfileScreenCopy,
) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return profileScreenCopy.loadErrorUnauthorized;
    }

    if (error.status === 403) {
      return profileScreenCopy.loadErrorForbidden;
    }
  }

  return profileScreenCopy.loadErrorFallback;
}

function ProfileMetaItem({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-emerald-700">
        {icon}
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
  ctaLabel,
  primary = false,
}: Readonly<{
  ctaLabel: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  primary?: boolean;
  title: string;
}>) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="px-6 pt-6">
        <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          {icon}
        </div>
        <CardTitle className="pt-2 text-[20px] font-semibold text-emerald-900">
          {title}
        </CardTitle>
        <CardDescription className="text-[14px] text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-start rounded-b-lg border-t border-slate-100 bg-slate-50/80 px-6 py-4">
        <Button
          asChild
          variant={primary ? "default" : "outline"}
          className={cn(
            "h-10 rounded-lg px-4 text-sm font-bold",
            primary
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          )}
        >
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AddressBookDialog({
  copy,
  isPending = false,
  onOpenChange,
  onSave,
  open,
  value,
}: Readonly<{
  copy: ProfileScreenCopy;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: AddressBookDraftInput) => Promise<boolean>;
  open: boolean;
  value: AddressBookDraftInput;
}>) {
  const profileScreenCopy = copy;
  const [draft, setDraft] = useState<AddressBookDraftInput>(value);
  const errors = useMemo(() => validateAddressDraft(draft), [draft]);
  const hasErrors = Object.values(errors).some(Boolean);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(value);
    }

    onOpenChange(nextOpen);
  }

  function updateField<Key extends keyof AddressBookDraftInput>(
    key: Key,
    fieldValue: AddressBookDraftInput[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: fieldValue,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[1.25rem] p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>
              {value.id
                ? profileScreenCopy.addressBook.dialogEditTitle
                : profileScreenCopy.addressBook.dialogCreateTitle}
            </DialogTitle>
            <DialogDescription>
              {profileScreenCopy.addressBook.dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address-label">
                {profileScreenCopy.addressBook.fields.label}
              </Label>
              <Input
                id="address-label"
                value={draft.label}
                onChange={(event) => updateField("label", event.target.value)}
                placeholder={profileScreenCopy.addressBook.placeholders.label}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3"
              />
              {errors.label ? (
                <p className="text-xs font-medium text-red-600">
                  {errors.label}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="address-contact">
                  {profileScreenCopy.addressBook.fields.contactName}
                </Label>
                <Input
                  id="address-contact"
                  value={draft.contactName}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  placeholder={
                    profileScreenCopy.addressBook.placeholders.contactName
                  }
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3"
                />
                {errors.contactName ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.contactName}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address-phone">
                  {profileScreenCopy.addressBook.fields.phone}
                </Label>
                <Input
                  id="address-phone"
                  value={draft.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder={profileScreenCopy.addressBook.placeholders.phone}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3"
                />
                {errors.phone ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address-line">
                {profileScreenCopy.addressBook.fields.addressLine}
              </Label>
              <Textarea
                id="address-line"
                value={draft.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder={
                  profileScreenCopy.addressBook.placeholders.addressLine
                }
                className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2.5"
              />
              {errors.address ? (
                <p className="text-xs font-medium text-red-600">
                  {errors.address}
                </p>
              ) : null}
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-900">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(event) =>
                  updateField("isDefault", event.target.checked)
                }
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              {profileScreenCopy.addressBook.fields.setAsDefault}
            </label>
          </div>
        </div>

        <DialogFooter className="rounded-b-[1.25rem] border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-10 rounded-lg border-slate-200 bg-white text-slate-700"
            onClick={() => handleOpenChange(false)}
          >
            {profileScreenCopy.addressBook.cancel}
          </Button>
          <Button
            type="button"
            disabled={hasErrors || isPending}
            className="h-10 rounded-lg bg-emerald-500 px-4 font-bold text-white hover:bg-emerald-600 disabled:hover:bg-emerald-500"
            onClick={async () => {
              if (await onSave(draft)) {
                handleOpenChange(false);
              }
            }}
          >
            {isPending
              ? profileScreenCopy.account.savePending
              : value.id
                ? profileScreenCopy.addressBook.save
                : profileScreenCopy.addressBook.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomerProfileScreen() {
  const { profileScreenCopy } = useI18nCopy();
  const {
    addresses,
    addressesQuery,
    deleteAddress,
    form,
    formErrors,
    isAddressMutating,
    isDirty,
    isSavingProfile,
    isValid,
    profile,
    profileQuery,
    resetProfileDraft,
    saveAddress,
    saveProfileDraft,
    saveState,
    setDefaultAddress,
    updateField,
  } = useCustomerProfileSettings();

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressDialogValue, setAddressDialogValue] =
    useState<AddressBookDraftInput>(createEmptyAddressDraft());

  if (profileQuery.isPending) {
    return (
      <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] bg-[#F0FDF4] p-6 md:p-8">
        <LoadingState
          title="Đang tải hồ sơ khách hàng"
          description="Hệ thống đang đồng bộ thông tin tài khoản và cài đặt gần nhất."
        />
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] bg-[#F0FDF4] p-6 md:p-8">
        <ErrorState
          title="Không thể tải hồ sơ"
          description={getProfileLoadErrorMessage(
            profileQuery.error,
            profileScreenCopy,
          )}
          action={
            <Button
              variant="outline"
              onClick={() => void profileQuery.refetch()}
            >
              Tải lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] bg-[#F0FDF4] p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
              Customer space
            </p>
            <h1 className="mt-2 text-[28px] font-bold text-emerald-900">
              {profileScreenCopy.title}
            </h1>
            <p className="mt-2 max-w-3xl text-[14px] leading-6 text-slate-600">
              {profileScreenCopy.description}
            </p>
          </div>
          <Badge
            className={cn(
              "h-8 rounded-full px-3 text-xs font-bold uppercase tracking-[0.14em]",
              saveState === "saved"
                ? "bg-emerald-100 text-emerald-800"
                : saveState === "saving"
                  ? "bg-sky-100 text-sky-800"
                  : "bg-amber-100 text-amber-800",
            )}
          >
            {saveState === "saved"
              ? profileScreenCopy.account.syncReady
              : saveState === "saving"
                ? profileScreenCopy.account.savePending
                : profileScreenCopy.account.syncPending}
          </Badge>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">
              {profileScreenCopy.tabs.account}
            </TabsTrigger>
            <TabsTrigger value="addresses">
              {profileScreenCopy.tabs.addressBook}
            </TabsTrigger>
            <TabsTrigger value="access">
              {profileScreenCopy.tabs.access}
            </TabsTrigger>
            <TabsTrigger value="security">
              {profileScreenCopy.tabs.security}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <Card className="overflow-hidden rounded-lg border border-emerald-200 bg-white py-0 shadow-sm">
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-700 px-6 py-6 text-white">
                  <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_58%)]" />
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <Avatar className="size-20 ring-4 ring-white/15">
                      <AvatarImage
                        alt={profile.fullName}
                        src={profile.avatarUrl ?? undefined}
                      />
                      <AvatarFallback className="bg-white/15 text-lg text-white">
                        {profile.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-2">
                      <Badge className="h-7 rounded-full bg-white/12 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        {formatEnumLabel(profile.role)}
                      </Badge>
                      <h2 className="text-2xl font-bold tracking-tight">
                        {profile.fullName}
                      </h2>
                      <p className="text-sm text-emerald-50/90">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-6 px-6 py-6">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/80 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      {profileScreenCopy.account.syncDescription}
                    </p>
                    <p className="mt-2 text-sm text-emerald-800/80">
                      {saveState === "saved"
                        ? profileScreenCopy.account.savedState
                        : saveState === "saving"
                          ? profileScreenCopy.account.savePending
                          : isDirty
                            ? profileScreenCopy.account.dirtyState
                            : profileScreenCopy.account.cleanState}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileMetaItem
                      icon={<IdCard className="size-4" />}
                      label={profileScreenCopy.account.profileId}
                      value={`#${profile.id}`}
                    />
                    <ProfileMetaItem
                      icon={<ShieldCheck className="size-4" />}
                      label={profileScreenCopy.account.role}
                      value={formatEnumLabel(profile.role)}
                    />
                    <ProfileMetaItem
                      icon={<MapPinned className="size-4" />}
                      label={profileScreenCopy.account.hubId}
                      value={
                        profile.hubId ? `Hub #${profile.hubId}` : "Chưa gán hub"
                      }
                    />
                    <ProfileMetaItem
                      icon={<Mail className="size-4" />}
                      label={profileScreenCopy.account.emailLabel}
                      value={profile.email}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg border border-slate-200 bg-white py-0 shadow-sm">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-[20px] font-semibold text-emerald-900">
                    {profileScreenCopy.account.cardTitle}
                  </CardTitle>
                  <CardDescription className="text-[14px] leading-6 text-slate-600">
                    {profileScreenCopy.account.cardDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 px-6 pb-6">
                  <div className="grid gap-2">
                    <Label htmlFor="profile-full-name">
                      {profileScreenCopy.account.fullNameLabel}
                    </Label>
                    <Input
                      id="profile-full-name"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                      placeholder={
                        profileScreenCopy.account.fullNamePlaceholder
                      }
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3"
                    />
                    {formErrors.fullName ? (
                      <p className="text-xs font-medium text-red-600">
                        {profileScreenCopy.account.validationName}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profile-phone">
                      {profileScreenCopy.account.phoneLabel}
                    </Label>
                    <Input
                      id="profile-phone"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder={profileScreenCopy.account.phonePlaceholder}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3"
                    />
                    {formErrors.phone ? (
                      <p className="text-xs font-medium text-red-600">
                        {profileScreenCopy.account.validationPhone}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profile-email">
                      {profileScreenCopy.account.emailLabel}
                    </Label>
                    <Input
                      id="profile-email"
                      value={profile.email}
                      disabled
                      className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500"
                    />
                    <p className="text-xs font-medium text-slate-500">
                      {profileScreenCopy.account.emailHint}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-3 rounded-b-lg border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSavingProfile}
                    className="h-10 rounded-lg border-slate-200 bg-white text-slate-700"
                    onClick={resetProfileDraft}
                  >
                    {profileScreenCopy.account.reset}
                  </Button>
                  <Button
                    type="button"
                    disabled={!isDirty || !isValid || isSavingProfile}
                    className="h-10 rounded-lg bg-emerald-500 px-5 font-bold text-white hover:bg-emerald-600"
                    onClick={() => void saveProfileDraft()}
                  >
                    {isSavingProfile
                      ? profileScreenCopy.account.savePending
                      : profileScreenCopy.account.save}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="rounded-lg border border-slate-200 bg-white py-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-[20px] font-semibold text-emerald-900">
                      {profileScreenCopy.addressBook.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-[14px] leading-6 text-slate-600">
                      {profileScreenCopy.addressBook.description}
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    disabled={isAddressMutating}
                    className="h-10 rounded-lg bg-emerald-500 px-4 font-bold text-white hover:bg-emerald-600"
                    onClick={() => {
                      setAddressDialogValue(createEmptyAddressDraft());
                      setIsAddressDialogOpen(true);
                    }}
                  >
                    {profileScreenCopy.addressBook.add}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {addressesQuery.isPending ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-4">
                    <LoadingState
                      title={profileScreenCopy.addressBook.loading}
                      description="Hệ thống đang đồng bộ danh sách địa chỉ hiện tại."
                    />
                  </div>
                ) : addressesQuery.isError ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-4">
                    <ErrorState
                      title={profileScreenCopy.addressBook.loadError}
                      description={addressesQuery.error.message}
                      action={
                        <Button
                          variant="outline"
                          onClick={() => void addressesQuery.refetch()}
                        >
                          Tải lại
                        </Button>
                      }
                    />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-4">
                    <EmptyState
                      title={profileScreenCopy.addressBook.emptyTitle}
                      description={
                        profileScreenCopy.addressBook.emptyDescription
                      }
                    />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-200"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-[16px] font-semibold text-emerald-900">
                                {address.label}
                              </h3>
                              {address.isDefault ? (
                                <Badge className="h-6 rounded-full bg-emerald-100 px-2.5 text-[11px] font-bold uppercase text-emerald-800">
                                  {profileScreenCopy.addressBook.defaultBadge}
                                </Badge>
                              ) : null}
                            </div>
                            <div className="grid gap-1 text-[14px] text-slate-600">
                              <p>
                                <span className="font-semibold text-slate-800">
                                  {address.contactName}
                                </span>{" "}
                                · {address.phone}
                              </p>
                              <p>{address.address}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {!address.isDefault ? (
                              <Button
                                type="button"
                                variant="outline"
                                disabled={isAddressMutating}
                                className="h-9 rounded-lg border-slate-200 bg-white text-slate-700"
                                onClick={() =>
                                  void setDefaultAddress(address.id)
                                }
                              >
                                {profileScreenCopy.addressBook.setDefault}
                              </Button>
                            ) : null}
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isAddressMutating}
                              className="h-9 rounded-lg border-slate-200 bg-white text-slate-700"
                              onClick={() => {
                                setAddressDialogValue({
                                  address: address.address,
                                  contactName: address.contactName,
                                  id: address.id,
                                  isDefault: address.isDefault,
                                  label: address.label,
                                  latitude: address.latitude ?? undefined,
                                  longitude: address.longitude ?? undefined,
                                  phone: address.phone,
                                });
                                setIsAddressDialogOpen(true);
                              }}
                            >
                              <PencilLine className="mr-2 size-4" />
                              {profileScreenCopy.addressBook.edit}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={isAddressMutating}
                              className="h-9 rounded-lg"
                              onClick={() => void deleteAddress(address.id)}
                            >
                              {profileScreenCopy.addressBook.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card className="rounded-lg border border-slate-200 bg-white py-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-[20px] font-semibold text-emerald-900">
                  {profileScreenCopy.access.title}
                </CardTitle>
                <CardDescription className="text-[14px] leading-6 text-slate-600">
                  {profileScreenCopy.access.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 px-6 pb-6 md:grid-cols-2">
                <ActionCard
                  href="/overview?notifications=1"
                  icon={<Bell className="size-5" />}
                  title={profileScreenCopy.access.notificationsTitle}
                  description={
                    profileScreenCopy.access.notificationsDescription
                  }
                  ctaLabel={profileScreenCopy.access.notificationsCta}
                  primary
                />
                <ActionCard
                  href="/role-requests"
                  icon={<ShieldCheck className="size-5" />}
                  title={profileScreenCopy.access.rolesTitle}
                  description={profileScreenCopy.access.rolesDescription}
                  ctaLabel={profileScreenCopy.access.rolesCta}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-lg border border-slate-200 bg-white py-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-[20px] font-semibold text-emerald-900">
                  {profileScreenCopy.security.title}
                </CardTitle>
                <CardDescription className="text-[14px] leading-6 text-slate-600">
                  {profileScreenCopy.security.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 px-6 pb-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Mail className="size-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-semibold text-emerald-900">
                        {profileScreenCopy.security.emailTitle}
                      </h3>
                      <p className="text-[14px] leading-6 text-slate-600">
                        {profileScreenCopy.security.emailDescription}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-slate-200" />
                  <div className="flex items-center gap-3 rounded-lg border border-white bg-white p-4">
                    <UserRound className="size-4 text-emerald-700" />
                    <span className="text-sm font-semibold text-slate-700">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                      <KeyRound className="size-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-semibold text-emerald-900">
                        {profileScreenCopy.security.resetTitle}
                      </h3>
                      <p className="text-[14px] leading-6 text-slate-600">
                        {profileScreenCopy.security.resetDescription}
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="mt-5 h-10 rounded-lg bg-emerald-500 px-4 font-bold text-white hover:bg-emerald-600"
                  >
                    <Link href="/auth/forgot-password">
                      {profileScreenCopy.security.resetCta}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddressBookDialog
        copy={profileScreenCopy}
        isPending={isAddressMutating}
        open={isAddressDialogOpen}
        value={addressDialogValue}
        onOpenChange={setIsAddressDialogOpen}
        onSave={saveAddress}
      />
    </div>
  );
}
