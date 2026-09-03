export interface WishlistItem {
  productId: string
  addedAt: string
  note?: string
}

export interface Wishlist {
  userId: string
  items: WishlistItem[]
}

export function addItem(list: Wishlist, productId: string, note?: string): Wishlist {
  if (list.items.some((i) => i.productId === productId)) return list
  return {
    userId: list.userId,
    items: [...list.items, { productId, addedAt: new Date().toISOString(), note }],
  }
}

export function removeItem(list: Wishlist, productId: string): Wishlist {
  return { ...list, items: list.items.filter((i) => i.productId !== productId) }
}

export function hasItem(list: Wishlist, productId: string): boolean {
  return list.items.some((i) => i.productId === productId)
}

export function moveToCart(list: Wishlist, productId: string): { list: Wishlist; moved: boolean } {
  if (!hasItem(list, productId)) return { list, moved: false }
  return { list: removeItem(list, productId), moved: true }
}
