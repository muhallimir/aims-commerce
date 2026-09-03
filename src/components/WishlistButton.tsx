import { Button } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

export function WishlistButton({ inList, onClick }: { inList: boolean; onClick: () => void }) {
  return (
    <Button
      data-testid="wlb"
      data-in-list={inList ? 'true' : 'false'}
      onClick={onClick}
      size="small"
      variant={inList ? 'contained' : 'outlined'}
      color={inList ? 'secondary' : 'inherit'}
      startIcon={inList ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    >
      {inList ? 'Remove from wishlist' : 'Add to wishlist'}
    </Button>
  )
}
