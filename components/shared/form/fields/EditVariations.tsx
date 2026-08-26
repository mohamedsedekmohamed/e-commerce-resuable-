import React, { useEffect, useState } from "react";
import { Plus, X, Trash2, Loader2 } from "lucide-react";
import { productsAdmin } from "@/services/products";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

type VariationId = string | number;

interface LocalizedName {
  en?: string;
  ar?: string;
}

interface VariationOption {
  id: VariationId;
  name?: LocalizedName;
  price?: string | number;
}

interface ProductVariation {
  id: VariationId;
  name?: LocalizedName;
  options?: VariationOption[];
}

interface EditVariationsProps {
  productId: VariationId;
  initialVariations?: unknown;
}

const isLocalizedName = (value: unknown): value is LocalizedName =>
  typeof value === "object" && value !== null;

const isVariationOption = (value: unknown): value is VariationOption => {
  if (!value || typeof value !== "object") return false;

  const option = value as Partial<VariationOption>;
  return (
    (typeof option.id === "string" || typeof option.id === "number") &&
    (option.name === undefined || isLocalizedName(option.name)) &&
    (option.price === undefined || typeof option.price === "string" || typeof option.price === "number")
  );
};

const isProductVariation = (value: unknown): value is ProductVariation => {
  if (!value || typeof value !== "object") return false;

  const variation = value as Partial<ProductVariation>;
  return (
    (typeof variation.id === "string" || typeof variation.id === "number") &&
    (variation.name === undefined || isLocalizedName(variation.name)) &&
    (variation.options === undefined ||
      (Array.isArray(variation.options) && variation.options.every(isVariationOption)))
  );
};

const isProductVariationList = (value: unknown): value is ProductVariation[] =>
  Array.isArray(value) && value.every(isProductVariation);

export default function EditVariations({ productId, initialVariations }: EditVariationsProps) {
  const t = useTranslations('admin.pages.products');
  const [variations, setVariations] = useState<ProductVariation[]>(() =>
    isProductVariationList(initialVariations) ? initialVariations : []
  );
  const [loadingVarId, setLoadingVarId] = useState<VariationId | null>(null);
  
  // For adding new variation
  const [isAddingVar, setIsAddingVar] = useState(false);
  const [newVar, setNewVar] = useState({ name_en: '', name_ar: '' });

  // For adding new option
  const [addingOptToVar, setAddingOptToVar] = useState<VariationId | null>(null);
  const [newOpt, setNewOpt] = useState({ name_en: '', name_ar: '', price: 0 });

  useEffect(() => {
    if (isProductVariationList(initialVariations)) {
      setVariations(initialVariations);
    }
  }, [initialVariations]);

  const fetchUpdatedProduct = () => {
    window.location.reload();
  };

  const handleAddVariation = async () => {
    if (!newVar.name_en || !newVar.name_ar) return;
    setIsAddingVar(true);
    try {
      await productsAdmin.addVariation(productId, {
        name: { en: newVar.name_en, ar: newVar.name_ar }
      });
      toast.success("Variation added successfully");
      fetchUpdatedProduct();
    } catch {
      toast.error("Error adding variation");
      setIsAddingVar(false);
    }
  };

  const handleDeleteVariation = async (varId: VariationId) => {
    if (!confirm("Are you sure?")) return;
    setLoadingVarId(varId);
    try {
      await productsAdmin.deleteVariation(varId);
      setVariations(prev => prev.filter(v => v.id !== varId));
      toast.success("Variation deleted");
    } catch {
      toast.error("Error deleting variation");
    } finally {
      setLoadingVarId(null);
    }
  };

  const handleAddOption = async (varId: VariationId) => {
    if (!newOpt.name_en || !newOpt.name_ar) return;
    setAddingOptToVar(varId);
    try {
      await productsAdmin.addOption(varId, {
        name: { en: newOpt.name_en, ar: newOpt.name_ar },
        price: newOpt.price
      });
      toast.success("Option added successfully");
      fetchUpdatedProduct();
    } catch {
      toast.error("Error adding option");
      setAddingOptToVar(null);
    }
  };

  const handleDeleteOption = async (varId: VariationId, optId: VariationId) => {
    if (!confirm("Are you sure?")) return;
    try {
      await productsAdmin.deleteOption(optId);
      setVariations(prev => prev.map(v => {
        if (v.id === varId) {
          return { ...v, options: v.options?.filter((option) => option.id !== optId) };
        }
        return v;
      }));
      toast.success("Option deleted");
    } catch {
      toast.error("Error deleting option");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {variations.map((variation) => (
        <div key={variation.id} className="border border-border rounded-xl p-4 bg-card/50 shadow-sm relative group">
          <button
            type="button"
            onClick={() => handleDeleteVariation(variation.id)}
            disabled={loadingVarId === variation.id}
            className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            {loadingVarId === variation.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
          
          <div className="mb-4 pr-12">
            <h4 className="font-bold text-lg">{variation.name?.en} / {variation.name?.ar}</h4>
          </div>

          <div className="bg-background rounded-xl p-4 border border-dashed">
            <h5 className="text-sm font-semibold mb-3">{t('options')}</h5>

            <div className="flex flex-col gap-3 mb-4">
              {variation.options?.map((option) => (
                <div key={option.id} className="flex flex-col md:flex-row gap-3 items-center bg-card p-3 rounded-lg border">
                  <div className="flex-1 w-full text-sm font-medium">
                    {option.name?.en} / {option.name?.ar}
                  </div>
                  <div className="w-full md:w-32 text-sm font-bold text-primary">
                    +{option.price}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(variation.id, option.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {(!variation.options || variation.options.length === 0) && (
                <div className="text-center p-4 text-sm text-muted-foreground bg-card rounded-lg border border-dashed">
                  No options
                </div>
              )}
            </div>

            {/* Add New Option Form */}
            <div className="flex flex-col md:flex-row gap-3 items-end bg-muted/20 p-3 rounded-lg border border-dashed">
              <div className="flex-1 w-full">
                <label className="block text-xs text-muted-foreground mb-1">{t('optionEn')}</label>
                <input
                  type="text"
                  value={addingOptToVar === variation.id ? newOpt.name_en : ''}
                  onChange={(e) => {
                    if (addingOptToVar !== variation.id) setAddingOptToVar(variation.id);
                    setNewOpt({...newOpt, name_en: e.target.value});
                  }}
                  className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs text-muted-foreground mb-1">{t('optionAr')}</label>
                <input
                  type="text"
                  value={addingOptToVar === variation.id ? newOpt.name_ar : ''}
                  onChange={(e) => {
                    if (addingOptToVar !== variation.id) setAddingOptToVar(variation.id);
                    setNewOpt({...newOpt, name_ar: e.target.value});
                  }}
                  className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs text-muted-foreground mb-1">{t('additionalPrice')}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={addingOptToVar === variation.id ? newOpt.price : 0}
                  onChange={(e) => {
                    if (addingOptToVar !== variation.id) setAddingOptToVar(variation.id);
                    setNewOpt({...newOpt, price: parseFloat(e.target.value) || 0});
                  }}
                  className="w-full p-2 text-sm rounded-lg border outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddOption(variation.id)}
                disabled={addingOptToVar === variation.id && (!newOpt.name_en || !newOpt.name_ar)}
                className="p-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Variation Form */}
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary/5">
        <h4 className="text-sm font-semibold mb-3 text-primary">{t('addVariation')}</h4>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t('variationNameEn')}</label>
            <input
              type="text"
              value={newVar.name_en}
              onChange={(e) => setNewVar({...newVar, name_en: e.target.value})}
              className="w-full p-2.5 text-sm rounded-xl border bg-card focus:border-primary outline-none"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t('variationNameAr')}</label>
            <input
              type="text"
              value={newVar.name_ar}
              onChange={(e) => setNewVar({...newVar, name_ar: e.target.value})}
              className="w-full p-2.5 text-sm rounded-xl border bg-card focus:border-primary outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleAddVariation}
            disabled={isAddingVar || !newVar.name_en || !newVar.name_ar}
            className="p-3 bg-primary text-white hover:bg-primary/90 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            {isAddingVar ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
