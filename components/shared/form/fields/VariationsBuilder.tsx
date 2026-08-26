  import React, { useMemo } from "react";
  import { Plus, X, Trash2 } from "lucide-react";
  import { Field } from "@/components/shared/form/FormTypes";
  import { useTranslations } from "next-intl";

  interface Option {
    id?: string | number;
    name_en: string;
    name_ar: string;
    price: number;
    deleted?: boolean;
  }

  interface Variation {
    id?: string | number;
    name_en: string;
    name_ar: string;
    options: Option[];
    deleted?: boolean;
  }

  interface VariationsBuilderProps {
    value?: unknown;
    onChange: (value: Variation[]) => void;
    error?: string;
    field: Field;
  }

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  const normalizeOption = (value: unknown): Option | null => {
    if (!isRecord(value)) return null;

    const localizedName = isRecord(value.name) ? value.name : {};
    const price = typeof value.price === "number"
      ? value.price
      : typeof value.price === "string" ? Number(value.price) : 0;

    return {
      ...(typeof value.id === "string" || typeof value.id === "number" ? { id: value.id } : {}),
      name_en: typeof value.name_en === "string" ? value.name_en : typeof localizedName.en === "string" ? localizedName.en : "",
      name_ar: typeof value.name_ar === "string" ? value.name_ar : typeof localizedName.ar === "string" ? localizedName.ar : "",
      price: Number.isFinite(price) ? price : 0,
      ...(value.deleted === true ? { deleted: true } : {}),
    };
  };

  const normalizeVariation = (value: unknown): Variation | null => {
    if (!isRecord(value)) return null;

    const localizedName = isRecord(value.name) ? value.name : {};
    const options = Array.isArray(value.options)
      ? value.options.map(normalizeOption).filter((option): option is Option => option !== null)
      : [];

    return {
      ...(typeof value.id === "string" || typeof value.id === "number" ? { id: value.id } : {}),
      name_en: typeof value.name_en === "string" ? value.name_en : typeof localizedName.en === "string" ? localizedName.en : "",
      name_ar: typeof value.name_ar === "string" ? value.name_ar : typeof localizedName.ar === "string" ? localizedName.ar : "",
      options,
      ...(value.deleted === true ? { deleted: true } : {}),
    };
  };

  const emptyOption = (): Option => ({ name_en: "", name_ar: "", price: 0 });
  const emptyVariation = (): Variation => ({ name_en: "", name_ar: "", options: [] });

  export default function VariationsBuilder({
    value,
    onChange,
    error,
    field,
  }: VariationsBuilderProps) {
    const t = useTranslations("admin.pages.products");
    const tForm = useTranslations("admin.form");
    const variations = useMemo(
      () =>
        Array.isArray(value)
          ? value.map(normalizeVariation).filter((variation): variation is Variation => variation !== null)
          : [],
      [value]
    );

    const addVariation = () => onChange([...variations, emptyVariation()]);

  const removeVariation = (index: number) => {
    const variation = variations[index];
    if (variation?.id !== undefined) {
      onChange(variations.map((item, variationIndex) =>
        variationIndex === index ? { ...item, deleted: true } : item
      ));
      return;
    }
    onChange(variations.filter((_, variationIndex) => variationIndex !== index));
    };

    const updateVariation = <Key extends keyof Variation>(
      index: number,
      key: Key,
      nextValue: Variation[Key]
    ) => {
      onChange(
        variations.map((variation, variationIndex) =>
          variationIndex === index ? { ...variation, [key]: nextValue } : variation
        )
      );
    };

    const addOption = (variationIndex: number) => {
      onChange(
        variations.map((variation, index) =>
          index === variationIndex
            ? { ...variation, options: [...variation.options, emptyOption()] }
            : variation
        )
      );
    };

  const removeOption = (variationIndex: number, optionIndex: number) => {
      onChange(
        variations.map((variation, index) =>
          index === variationIndex
            ? {
              ...variation,
              options: variation.options[optionIndex]?.id !== undefined
                ? variation.options.map((option, currentOptionIndex) =>
                    currentOptionIndex === optionIndex ? { ...option, deleted: true } : option
                  )
                : variation.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex),
              }
            : variation
        )
      );
    };

    const updateOption = <Key extends keyof Option>(
      variationIndex: number,
      optionIndex: number,
      key: Key,
      nextValue: Option[Key]
    ) => {
      onChange(
        variations.map((variation, index) =>
          index === variationIndex
            ? {
                ...variation,
                options: variation.options.map((option, currentOptionIndex) =>
                  currentOptionIndex === optionIndex ? { ...option, [key]: nextValue } : option
                ),
              }
            : variation
        )
      );
    };

    return (
      <div className="flex flex-col gap-4 w-full">
        {variations.map((variation, variationIndex) => ({ variation, variationIndex }))
          .filter(({ variation }) => !variation.deleted)
          .map(({ variation, variationIndex }) => (
          <div key={variationIndex} className="border border-border rounded-xl p-4 bg-card/50 shadow-sm relative group">
            <button
            type="button"
            onClick={() => removeVariation(variationIndex)}
            aria-label={t("removeVariation")}
            title={t("removeVariation")}
              className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12 mb-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("variationNameEn")}</label>
                <input
                  type="text"
                  placeholder={t("placeholderSizeEn")}
                  value={variation.name_en}
                  onChange={(event) => updateVariation(variationIndex, "name_en", event.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border bg-card focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("variationNameAr")}</label>
                <input
                  type="text"
                  placeholder={t("placeholderSizeAr")}
                  value={variation.name_ar}
                  onChange={(event) => updateVariation(variationIndex, "name_ar", event.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border bg-card focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-dashed">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold">{t("options")}</span>
                <button
                  type="button"
                  onClick={() => addOption(variationIndex)}
                  className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus size={14} /> {t("addOption")}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {variation.options.map((option, optionIndex) => ({ option, optionIndex }))
                  .filter(({ option }) => !option.deleted)
                  .map(({ option, optionIndex }) => (
                  <div key={optionIndex} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-card p-3 rounded-lg border">
                    <div className="flex-1 w-full">
                      <label className="block text-xs text-muted-foreground mb-1">{t("optionEn")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholderOptionEn")}
                      value={option.name_en}
                        onChange={(event) => updateOption(variationIndex, optionIndex, "name_en", event.target.value)}
                        className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs text-muted-foreground mb-1">{t("optionAr")}</label>
                    <input
                      type="text"
                      placeholder={t("placeholderOptionAr")}
                      value={option.name_ar}
                        onChange={(event) => updateOption(variationIndex, optionIndex, "name_ar", event.target.value)}
                        className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <label className="block text-xs text-muted-foreground mb-1">{t("additionalPrice")}</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={option.price}
                        onChange={(event) => updateOption(variationIndex, optionIndex, "price", parseFloat(event.target.value) || 0)}
                        className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                      />
                    </div>
                    <button
                    type="button"
                    onClick={() => removeOption(variationIndex, optionIndex)}
                    aria-label={t("removeOption")}
                    title={t("removeOption")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg md:mt-5"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {variation.options.filter((option) => !option.deleted).length === 0 && (
                  <div className="text-center p-4 text-sm text-muted-foreground bg-card rounded-lg border border-dashed">
                    {tForm("empty")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariation}
          className="w-full p-3 border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
          aria-label={field.label}
        >
          <Plus size={18} />
          {t("addVariation")}
        </button>

        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
