"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import {
  useCreateLanguage,
  useDeleteLanguage,
  useLanguagesQuery,
  useUpdateLanguage,
} from "@/features/language/presentation/hooks/useLanguages";
import type { LanguageDto } from "@/features/language/domain/types/language.types";
import { useLocalizedApiErrorMessage } from "@/i18n/localized-error";

const emptyLanguage: LanguageDto = {
  code: "",
  id: "",
  name: "",
};

export default function LanguageManagementScreen() {
  const t = useTranslations("language.management");
  const getErrorMessage = useLocalizedApiErrorMessage();
  const [form, setForm] = useState<LanguageDto>(emptyLanguage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const languagesQuery = useLanguagesQuery();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();

  const activeError =
    createLanguage.error ?? updateLanguage.error ?? deleteLanguage.error ?? null;
  const errorMessage = activeError ? getErrorMessage(activeError) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      await updateLanguage.mutateAsync(form);
    } else {
      await createLanguage.mutateAsync(form);
    }

    setEditingId(null);
    setForm(emptyLanguage);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
          Admin Languages
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-on-surface/60">
          {t("description")}
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {t("id")}
              </span>
              <input
                value={form.id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, id: event.target.value }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                placeholder={t("idPlaceholder")}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {t("name")}
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                placeholder={t("namePlaceholder")}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {t("code")}
              </span>
              <input
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({ ...current, code: event.target.value }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                placeholder={t("codePlaceholder")}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              {editingId ? t("update") : t("createLanguage")}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyLanguage);
                }}
                className="rounded-xl border border-outline-variant/20 px-5 py-3 text-sm font-semibold"
              >
                {t("cancelEdit")}
              </button>
            ) : null}
          </div>

          {activeError ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </form>

        <section className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-on-surface">
              {t("listTitle")}
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
              {t("countLabel", { count: languagesQuery.data?.totalItems ?? 0 })}
            </span>
          </div>

          {languagesQuery.isPending ? (
            <p className="text-sm text-on-surface/60">{t("loading")}</p>
          ) : (
            <div className="space-y-3">
              {languagesQuery.data?.data.length ? languagesQuery.data.data.map((language) => (
                <div
                  key={language.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant/10 bg-background px-4 py-3"
                >
                  <div>
                    <p className="font-bold text-on-surface">{language.name}</p>
                    <p className="text-xs text-on-surface/55">
                      {language.id} • {language.code}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(language.id);
                        setForm(language);
                      }}
                      className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs font-semibold"
                    >
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteLanguage.mutateAsync(language.id)}
                      className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-on-surface/60">{t("empty")}</p>
              )}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
