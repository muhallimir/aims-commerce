import React, { useState } from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import useThemeMode from "src/hooks/useThemeMode";
import { SearchBarProps } from "@common/interface";

const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search products...",
	value = "",
}) => {
	const { isDarkMode } = useThemeMode();
	const [searchQuery, setSearchQuery] = useState(value);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);
		onSearch(query);
	};

	return (
		<Box
			sx={{
				width: "100%",
				mb: 4,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<TextField
				variant="outlined"
				placeholder={placeholder}
				value={searchQuery}
				onChange={handleSearchChange}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					),
				}}
				sx={{
					width: { xs: "100%", sm: "60%", md: "50%" },
					"& .MuiOutlinedInput-root": {
						transition: "all 0.3s ease",
						"&:hover fieldset": {
							borderColor: isDarkMode ? "gold" : "primary.main",
						},
						"&.Mui-focused fieldset": {
							borderColor: isDarkMode ? "gold" : "primary.main",
							boxShadow: isDarkMode ? "0 0 10px gold" : "none",
						},
					},
					"& .MuiInputBase-root": {
						color: isDarkMode ? "gold" : "primary",
					},
					"& .MuiInputAdornment-root": {
						color: isDarkMode ? "gold" : "inherit",
					},
				}}
			/>
		</Box>
	);
};

export default SearchBar;
