import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { updateShippingAddress } from "@store/cart.slice";

const KEY = "aims-address-book";

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  contactNo: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export function loadBook(): SavedAddress[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveBook(list: SavedAddress[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

const EMPTY = { label: "", fullName: "", contactNo: "", address: "", city: "", postalCode: "", country: "" };

/**
 * Address book: named delivery addresses on this device, one tap
 * to reuse at shipping.
 */
export function AddressBook() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [book, setBook] = useState<SavedAddress[]>([]);
  const [draft, setDraft] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    setBook(loadBook());
  }, []);

  function persist(list: SavedAddress[]) {
    setBook(list);
    saveBook(list);
  }

  function add() {
    if (!draft.label.trim() || !draft.fullName.trim() || !draft.address.trim() || !draft.city.trim()) {
      setError("Label, name, street and city are required.");
      return;
    }
    setError("");
    persist([...book, { ...draft, id: `addr-${Date.now()}` }]);
    setDraft(EMPTY);
  }

  function useAddress(a: SavedAddress) {
    dispatch(
      updateShippingAddress({
        fullName: a.fullName,
        contactNo: a.contactNo,
        address: a.address,
        city: a.city,
        postalCode: a.postalCode,
        country: a.country,
      })
    );
    router.push("/store/shipping");
  }

  return (
    <Card data-testid="address-book" variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Address book</Typography>
        <Typography variant="body2" color="text.secondary">
          Saved on this device. One tap reuses an address at shipping.
        </Typography>
        {book.map((a) => (
          <Box key={a.id} data-testid={`address-entry-${a.id}`} sx={{ mt: 1, p: 1, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle2">{a.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {a.fullName} · {a.address}, {a.city} {a.postalCode}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <Button data-testid={`address-use-${a.id}`} size="small" variant="contained" onClick={() => useAddress(a)}>
                Deliver here
              </Button>
              <Button
                data-testid={`address-remove-${a.id}`}
                size="small"
                color="error"
                onClick={() => persist(book.filter((x) => x.id !== a.id))}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ))}
        <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
          <Typography variant="subtitle2">Add an address</Typography>
          {(
            [
              ["label", "Label (Home, Office…)"],
              ["fullName", "Full name"],
              ["contactNo", "Contact number"],
              ["address", "Street address"],
              ["city", "City"],
              ["postalCode", "Postcode"],
              ["country", "Country"],
            ] as const
          ).map(([key, label]) => (
            <TextField
              key={key}
              inputProps={{ "data-testid": `address-field-${key}` }}
              size="small"
              label={label}
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              fullWidth
            />
          ))}
          {error && (
            <Alert data-testid="address-error" severity="error">
              {error}
            </Alert>
          )}
          <Button data-testid="address-add" variant="outlined" onClick={add}>
            Save address
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
