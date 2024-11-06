import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Grid, Box, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function HomePage() {
    let [products, setProducts] = useState([]);
    let [category, setCategory] = useState('All');
    let [itemName, setItemName] = useState('');
    let [ogData, setOgData] = useState([]);
    let [price, setPrice] = useState(0);
    let [isAdmin, setIsAdmin] = useState(false); 
    let navigate = useNavigate();

    function loadProducts() {
        axios.get(process.env.REACT_APP_API_URL + "/api/products")
            .then((res) => {
                setProducts(res.data);
                setOgData(res.data);
            }).catch(() => {});
    }

    useEffect(() => {
        loadProducts();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        let filteredProducts = ogData;
        if (category !== 'All') {
            filteredProducts = filteredProducts.filter((x) => x.productType === category);
        }
        if (itemName.trim() !== '') {
            filteredProducts = filteredProducts.filter((x) => 
                x.title.toLowerCase().includes(itemName.toLowerCase())
            );
        }
        if (price !== 0) {
            filteredProducts = filteredProducts.filter((x) => 
                Math.trunc(x.price) === parseInt(price)
            );
        }
        setProducts(filteredProducts);
    }, [category, itemName, price, ogData]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/'); 
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
            <AppBar position="static" color="primary" elevation={3}>
                <Toolbar>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        My E-Commerce Store
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                        />
                    </Search>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => navigate('/admin')}
                            sx={{ mx: 1 }}
                        >
                            Admin Panel
                        </Button>
                    )}
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 4, ml: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Speaker">Speaker</option>
                </select>
            </Box>

            <main className="flex-grow p-6">
                <Typography variant="h4" gutterBottom>Featured Products</Typography>
                <Grid container spacing={4}>
                    {products.map(product => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <Paper elevation={3} sx={{ p: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                                <img className="w-full h-48 rounded-t-lg" src={product.image} alt={product.title} />
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="h6" component="h2">{product.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">₹{product.price.toFixed(2)}</Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth 
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        sx={{ mt: 2 }}
                                    >
                                        View Product
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </main>

            <Box sx={{ backgroundColor: '#1976d2', color: 'white', textAlign: 'center', py: 2 }}>
                <Typography>&copy; 2024 My E-Commerce Store</Typography>
            </Box>
        </Box>
    );
}

