<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { formatNPR, isLowStock, isOutOfStock } from '$lib/utils';
  import { toasts } from '$lib/toast.svelte';
  import { Plus, Edit, Trash2, Star, Eye, EyeOff, Package, AlertTriangle } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  $effect(() => {
    if (form?.success) {
      toasts.success('Action completed successfully');
      // Reload page data
      window.location.reload();
    } else if (form?.error) {
      toasts.error(form.error);
    }
  });

  let showCategoryForm = $state(false);
  let categoryName = $state('');

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    const formData = new FormData();
    formData.append('id', id);

    const response = await fetch('?/delete', { method: 'POST', body: formData });
    if (response.ok) {
      toasts.success('Product deleted');
      window.location.reload();
    } else {
      toasts.error('Failed to delete product');
    }
  }

  async function handleTogglePublish(id: string, current: boolean) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('is_published', String(current));

    await fetch('?/togglePublish', { method: 'POST', body: formData });
    toasts.success(current ? 'Product unpublished' : 'Product published');
    window.location.reload();
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('is_featured', String(current));

    await fetch('?/toggleFeatured', { method: 'POST', body: formData });
    toasts.success(current ? 'Removed from featured' : 'Added to featured');
    window.location.reload();
  }

  async function handleCreateCategory() {
    if (!categoryName.trim()) return;

    const formData = new FormData();
    formData.append('category_name', categoryName);

    await fetch('?/createCategory', { method: 'POST', body: formData });
    toasts.success('Category created');
    categoryName = '';
    showCategoryForm = false;
    window.location.reload();
  }
</script>

<svelte:head>
  <title>Products — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="font-serif text-2xl font-bold text-brown">Product Management</h1>
      <p class="text-sm text-brown-light mt-1">{data.products.length} products total</p>
    </div>
    <div class="flex gap-2">
      <button onclick={() => (showCategoryForm = !showCategoryForm)} class="btn-ghost text-sm">
        + Category
      </button>
      <a href="/admin/products/new" class="btn-primary text-sm flex items-center gap-2">
        <Plus class="w-4 h-4" />
        Add Product
      </a>
    </div>
  </div>

  {#if showCategoryForm}
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 flex flex-col sm:flex-row gap-2">
      <input type="text" bind:value={categoryName} placeholder="Category name (e.g. Scented Candles)" class="input-field flex-1" />
      <div class="flex gap-2">
        <button onclick={handleCreateCategory} class="btn-primary text-sm">Create</button>
        <button onclick={() => (showCategoryForm = false)} class="btn-ghost text-sm">Cancel</button>
      </div>
    </div>
  {/if}

  <!-- Products Table -->
  <div class="bg-white rounded-xl border border-beige-dark/30 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-beige/50 text-brown-light">
          <tr>
            <th class="text-left px-4 py-3 font-medium">Image</th>
            <th class="text-left px-4 py-3 font-medium">Name</th>
            <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
            <th class="text-right px-4 py-3 font-medium">Price</th>
            <th class="text-center px-4 py-3 font-medium hidden sm:table-cell">Stock</th>
            <th class="text-center px-4 py-3 font-medium">Status</th>
            <th class="text-center px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-beige-dark/20">
          {#each data.products as product (product.id)}
            <tr class="hover:bg-beige/30 transition-colors">
              <td class="px-4 py-3">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-beige shrink-0">
                  {#if product.images && product.images.length > 0}
                    <img src={product.images[0]} alt={product.name} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center"><Package class="w-5 h-5 text-brown-light/30" /></div>
                  {/if}
                </div>
              </td>
              <td class="px-4 py-3">
                <a href="/product/{product.slug}" target="_blank" class="text-brown font-medium hover:text-gold transition-colors">
                  {product.name}
                </a>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell text-brown-light text-xs">{product.category?.name || 'Uncategorized'}</td>
              <td class="px-4 py-3 text-right">
                <span class="font-medium text-brown">{formatNPR(product.discount_price ?? product.price)}</span>
                {#if product.discount_price}
                  <span class="text-xs text-brown-light/50 line-through block">{formatNPR(product.price)}</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                {#if isOutOfStock(product.stock)}
                  <span class="badge-danger">Out</span>
                {:else if isLowStock(product.stock)}
                  <span class="badge-warning flex items-center gap-1"><AlertTriangle class="w-3 h-3" />{product.stock}</span>
                {:else}
                  <span class="text-brown">{product.stock}</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  {#if product.is_published}
                    <button onclick={() => handleTogglePublish(product.id, true)} class="p-1.5 rounded text-success hover:bg-success/10" title="Published — click to unpublish">
                      <Eye class="w-4 h-4" />
                    </button>
                  {:else}
                    <button onclick={() => handleTogglePublish(product.id, false)} class="p-1.5 rounded text-brown-light/50 hover:bg-beige" title="Unpublished — click to publish">
                      <EyeOff class="w-4 h-4" />
                    </button>
                  {/if}
                  {#if product.is_featured}
                    <button onclick={() => handleToggleFeatured(product.id, true)} class="p-1.5 rounded text-gold hover:bg-gold/10" title="Featured">
                      <Star class="w-4 h-4 fill-current" />
                    </button>
                  {/if}
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-1">
                  <a href="/admin/products/{product.id}" class="p-1.5 rounded text-brown-light hover:bg-beige hover:text-gold" title="Edit">
                    <Edit class="w-4 h-4" />
                  </a>
                  <button onclick={() => handleDelete(product.id, product.name)} class="p-1.5 rounded text-danger hover:bg-danger/10" title="Delete">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if data.products.length === 0}
      <div class="p-8 text-center text-brown-light/50">
        <Package class="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p class="text-sm">No products yet. Click "Add Product" to create your first candle.</p>
      </div>
    {/if}
  </div>
</div>
