<script lang="ts">
  import type { PageData } from './$types';
  import { toasts } from '$lib/toast.svelte';
  import { Upload, X, ChevronLeft, Star, Eye, Trash2 } from 'lucide-svelte';
  import { env as publicEnv } from '$env/dynamic/public';
  import { createBrowserClient } from '@supabase/ssr';
  import type { Database } from '$lib/types/database';

  let { data }: { data: PageData } = $props();

  let uploadedImages = $state<string[]>(data.product.images || []);
  let uploading = $state(false);
  let supabaseBrowser = $state<ReturnType<typeof createBrowserClient<Database>> | null>(null);

  $effect(() => {
    if (publicEnv.PUBLIC_SUPABASE_URL && publicEnv.PUBLIC_SUPABASE_ANON_KEY) {
      // Reuse the SSR auth cookie so Storage receives the authenticated admin JWT.
      supabaseBrowser = createBrowserClient<Database>(
        publicEnv.PUBLIC_SUPABASE_URL,
        publicEnv.PUBLIC_SUPABASE_ANON_KEY
      );
    }
  });

  async function handleFileUpload(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    if (!input.files || !supabaseBrowser) return;

    uploading = true;

    const { data: { session }, error: sessionError } = await supabaseBrowser.auth.getSession();
    if (sessionError || !session) {
      toasts.error('Your admin session expired. Please sign in again.');
      uploading = false;
      input.value = '';
      return;
    }

    for (const file of Array.from(input.files)) {
      if (file.size > 5 * 1024 * 1024) {
        toasts.error(`${file.name} is too large. Maximum 5MB.`);
        continue;
      }

      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabaseBrowser.storage
        .from('bch-product-images')
        .upload(filePath, file, { cacheControl: '3600' });

      if (error) {
        toasts.error(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabaseBrowser.storage
        .from('bch-product-images')
        .getPublicUrl(filePath);

      uploadedImages = [...uploadedImages, urlData.publicUrl];
      toasts.success(`${file.name} uploaded`);
    }

    uploading = false;
    input.value = '';
  }

  function removeImage(url: string) {
    uploadedImages = uploadedImages.filter((img) => img !== url);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    const formData = new FormData();
    const response = await fetch('?/delete', { method: 'POST', body: formData });
    if (response.ok) {
      toasts.success('Product deleted');
      window.location.href = '/admin/products';
    } else {
      toasts.error('Failed to delete product');
    }
  }
</script>

<svelte:head>
  <title>Edit Product — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <a href="/admin/products" class="inline-flex items-center gap-1 text-sm text-brown-light hover:text-gold transition-colors mb-2">
        <ChevronLeft class="w-4 h-4" /> Back to Products
      </a>
      <h1 class="font-serif text-2xl font-bold text-brown">Edit Product</h1>
    </div>
    <button onclick={handleDelete} class="btn-ghost text-danger text-sm flex items-center gap-1">
      <Trash2 class="w-4 h-4" /> Delete
    </button>
  </div>

  <form method="POST" action="?/update" class="space-y-6">
    <!-- Image Upload -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-3">Product Images <span class="text-danger">*</span></h2>

      <label class="block border-2 border-dashed border-beige-dark rounded-lg p-6 text-center cursor-pointer hover:border-gold transition-colors">
        <input type="file" accept="image/*" multiple onchange={handleFileUpload} class="hidden" />
        {#if uploading}
          <p class="text-brown-light">Uploading...</p>
        {:else}
          <Upload class="w-8 h-8 mx-auto mb-2 text-brown-light/50" />
          <p class="text-sm text-brown-light">Click to upload more images</p>
        {/if}
      </label>

      {#if uploadedImages.length > 0}
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mt-3">
          {#each uploadedImages as img, i}
            <div class="relative aspect-square rounded-lg overflow-hidden bg-beige group">
              <img src={img} alt="Product image {i + 1}" class="w-full h-full object-cover" />
              {#if i === 0}
                <div class="absolute bottom-0 left-0 right-0 bg-gold text-white text-xs text-center py-0.5">Primary</div>
              {/if}
              <button
                type="button"
                onclick={() => removeImage(img)}
                class="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X class="w-3 h-3 text-danger" />
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-xs text-danger mt-2">No images. Please upload at least one image.</p>
      {/if}

      <input type="hidden" name="images" value={JSON.stringify(uploadedImages)} />
    </div>

    <!-- Product Details -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-4">Product Details</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label for="name" class="block text-sm font-medium text-brown mb-1">Product Name <span class="text-danger">*</span></label>
          <input id="name" name="name" type="text" class="input-field" value={data.product.name} required />
        </div>

        <div class="sm:col-span-2">
          <label for="description" class="block text-sm font-medium text-brown mb-1">Description <span class="text-danger">*</span></label>
          <textarea id="description" name="description" rows="4" class="input-field" required>{data.product.description}</textarea>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-brown mb-1">Price (Rs.) <span class="text-danger">*</span></label>
          <input id="price" name="price" type="number" step="0.01" min="0" class="input-field" value={data.product.price} required />
        </div>

        <div>
          <label for="discount_price" class="block text-sm font-medium text-brown mb-1">Discount Price (Rs.) <span class="text-brown-light/50">(optional)</span></label>
          <input id="discount_price" name="discount_price" type="number" step="0.01" min="0" class="input-field" value={data.product.discount_price || ''} />
        </div>

        <div>
          <label for="category_id" class="block text-sm font-medium text-brown mb-1">Category</label>
          <select id="category_id" name="category_id" class="input-field cursor-pointer">
            <option value="">Select Category</option>
            {#each data.categories as cat}
              <option value={cat.id} selected={data.product.category_id === cat.id}>{cat.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="stock" class="block text-sm font-medium text-brown mb-1">Stock Quantity <span class="text-danger">*</span></label>
          <input id="stock" name="stock" type="number" min="0" class="input-field" value={data.product.stock} required />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_featured" class="w-4 h-4 accent-gold" checked={data.product.is_featured} />
          <span class="text-sm text-brown flex items-center gap-1"><Star class="w-4 h-4 text-gold" /> Featured Product</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_published" class="w-4 h-4 accent-gold" checked={data.product.is_published} />
          <span class="text-sm text-brown flex items-center gap-1"><Eye class="w-4 h-4 text-success" /> Published</span>
        </label>
      </div>
    </div>

    <div class="flex gap-3">
      <button type="submit" class="btn-primary">Save Changes</button>
      <a href="/admin/products" class="btn-ghost">Cancel</a>
    </div>
  </form>
</div>
