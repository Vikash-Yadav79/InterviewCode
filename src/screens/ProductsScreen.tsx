import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  TextInput,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToBag, removeFromBag } from '../store/bagSlice';
import { RootState } from '../store/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const ProductsScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.items);
  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0);

  // Check if product is in bag
  const isInBag = (productId: number) => {
    return bagItems.some(item => item.id === productId);
  };

  // Check if product is favorite
  const isFavorite = (productId: number) => {
    return favorites.includes(productId);
  };

  // Filter states
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<string[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  // Sort state
  const [selectedSort, setSelectedSort] = useState('Newest arrivals');
  const [selectedFilterMenu, setSelectedFilterMenu] = useState('suggested');

  // Filter options
  const genderOptions = ['Men', 'Women', 'Unisex'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = [
    'Black',
    'White',
    'Blue',
    'Red',
    'Green',
    'Yellow',
    'Brown',
    'Grey',
  ];
  const brandOptions = [
    'Vashions',
    'Zudio',
    'Puma',
    'Nike',
    'Adidas',
    'H&M',
    'Zara',
    'Mango',
  ];
  const discountOptions = [
    '10% off',
    '20% off',
    '30% off',
    '40% off',
    '50% off',
    '60% off',
  ];
  const deliveryOptions = [
    '2 days delivery',
    '3 days delivery',
    '5 days delivery',
    '7 days delivery',
  ];

  const sortOptions = [
    'Newest arrivals',
    'Price - Low to High',
    'Price - High to Low',
    'Offers and discounts',
    'Best sellers',
  ];

  const suggestedFilters = [
    { id: 'suggested', label: 'Suggested filters' },
    { id: 'gender', label: 'Gender' },
    { id: 'price', label: 'Price' },
    { id: 'brand', label: 'Brand' },
    { id: 'fabric', label: 'Fabric' },
    { id: 'fit', label: 'Fit' },
    { id: 'size', label: 'Size' },
    { id: 'color', label: 'Color' },
    { id: 'discounts', label: 'Discounts' },
    { id: 'delivery', label: 'Delivery time' },
  ];

  const mostlyUsedFilters = [
    { id: 'delivery_2days', label: '2 days delivery', category: 'delivery' },
    { id: 'color_brown', label: 'Brown', category: 'color' },
    { id: 'price_under_700', label: 'Under ₹700', category: 'price' },
    { id: 'discount_50', label: '50% off', category: 'discount' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [
    selectedGender,
    selectedSizes,
    selectedColors,
    selectedBrands,
    selectedDiscount,
    selectedDelivery,
    priceFrom,
    priceTo,
    selectedSort,
    products,
  ]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...products];

    if (selectedGender.length > 0) {
      filtered = filtered.filter(product => {
        if (
          selectedGender.includes('Men') &&
          product.category.includes("men's")
        )
          return true;
        if (
          selectedGender.includes('Women') &&
          product.category.includes("women's")
        )
          return true;
        if (selectedGender.includes('Unisex')) return true;
        return false;
      });
    }

    const fromPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const toPrice = priceTo ? parseFloat(priceTo) : Infinity;
    filtered = filtered.filter(
      product => product.price >= fromPrice && product.price <= toPrice,
    );

    if (selectedDiscount.length > 0) {
      filtered = filtered.filter((_, index) => {
        const discount = getDiscount(products[index]?.price || 0);
        return selectedDiscount.some(d => {
          const value = parseInt(d);
          return discount >= value;
        });
      });
    }

    switch (selectedSort) {
      case 'Price - Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price - High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Newest arrivals':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'Best sellers':
        filtered.sort((a, b) => b.rating.count - a.rating.count);
        break;
      case 'Offers and discounts':
        filtered.sort((a, b) => getDiscount(b.price) - getDiscount(a.price));
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearAllFilters = () => {
    setSelectedGender([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedDiscount([]);
    setSelectedDelivery([]);
    setPriceFrom('');
    setPriceTo('');
    setSelectedSort('Newest arrivals');
    setExpandedFilter(null);
  };

  const toggleFilterOption = (category: string, value: string) => {
    let setter: any;
    let current: string[];

    switch (category) {
      case 'gender':
        current = selectedGender;
        setter = setSelectedGender;
        break;
      case 'size':
        current = selectedSizes;
        setter = setSelectedSizes;
        break;
      case 'color':
        current = selectedColors;
        setter = setSelectedColors;
        break;
      case 'brand':
        current = selectedBrands;
        setter = setSelectedBrands;
        break;
      case 'discount':
        current = selectedDiscount;
        setter = setSelectedDiscount;
        break;
      case 'delivery':
        current = selectedDelivery;
        setter = setSelectedDelivery;
        break;
      default:
        return;
    }

    if (current.includes(value)) {
      setter(current.filter(item => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  // Toggle favorite - Only for favorites list
  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  // Handle Add to Bag
  const handleAddToBag = (product: Product) => {
    if (isInBag(product.id)) {
      dispatch(removeFromBag(product.id));
    } else {
      dispatch(
        addToBag({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        }),
      );
    }
  };

  const getOriginalPrice = (price: number) => {
    const markup = 1 + (0.3 + Math.random() * 0.4);
    return (price * markup).toFixed(0);
  };

  const getDiscount = (price: number) => {
    const original = parseFloat(getOriginalPrice(price));
    const discount = ((original - price) / original) * 100;
    return Math.round(discount);
  };

  const getBrandName = (category: string) => {
    const brands = {
      "men's clothing": ['Vashions', 'Zudio', 'Puma', 'Nike', 'Adidas'],
      "women's clothing": ['Vashions', 'Zudio', 'H&M', 'Zara', 'Mango'],
      jewelery: ['Titan', 'Tanishq', 'Malabar Gold'],
      electronics: ['Samsung', 'Apple', 'Sony', 'LG'],
    };
    const brandList = brands[category as keyof typeof brands] || [
      'Vashions',
      'Zudio',
    ];
    const index = Math.floor(Math.random() * brandList.length);
    return brandList[index];
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const originalPrice = getOriginalPrice(product.price);
    const discount = getDiscount(product.price);
    const brandName = getBrandName(product.category);
    const inBag = isInBag(product.id);
    const fav = isFavorite(product.id);

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(product.id)}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={20}
              color={fav ? '#FF3B30' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.brandName}>{brandName}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>₹{product.price.toFixed(0)}</Text>
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>

          {/* Add to Bag Button */}
          <TouchableOpacity
            style={[styles.addToBagButton, inBag && styles.removeButton]}
            onPress={() => handleAddToBag(product)}
          >
            <Text style={styles.addToBagText}>
              {inBag ? 'Remove from Bag' : 'Add to Bag'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilterOptions = (category: string) => {
    let options: string[] = [];
    let selected: string[] = [];

    switch (category) {
      case 'gender':
        options = genderOptions;
        selected = selectedGender;
        break;
      case 'size':
        options = sizeOptions;
        selected = selectedSizes;
        break;
      case 'color':
        options = colorOptions;
        selected = selectedColors;
        break;
      case 'brand':
        options = brandOptions;
        selected = selectedBrands;
        break;
      case 'discount':
        options = discountOptions;
        selected = selectedDiscount;
        break;
      case 'delivery':
        options = deliveryOptions;
        selected = selectedDelivery;
        break;
      default:
        return null;
    }

    return (
      <View style={styles.filterOptionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              selected.includes(option) && styles.filterChipSelected,
            ]}
            onPress={() => toggleFilterOption(category, option)}
          >
            <Text
              style={[
                styles.filterChipText,
                selected.includes(option) && styles.filterChipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>T-shirts</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Bag')}
            style={styles.headerButton}
          >
            <View>
              <Ionicons name="bag-outline" size={24} color="#000" />
              {bagCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bagCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          Showing{' '}
          <Text style={styles.resultsCount}>
            {filteredProducts.length} results
          </Text>{' '}
          for{' '}
          <Text style={styles.searchKeyword}>Slim Fit XL Men's T-shirts</Text>
        </Text>
      </View>

      {/* Sort first, then Filters */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <View style={styles.actionButtonsWrapper}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSort(true)}
          >
            <Ionicons name="funnel-outline" size={18} color="#000" />
            <Text style={styles.actionButtonText}>Sort by</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={18} color="#000" />
            <Text style={styles.actionButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />

      {/* Sort Modal - First */}
      <Modal
        visible={showSort}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSort(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSort(false)}>
                <Ionicons name="close-outline" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            {sortOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSelectedSort(option);
                  setShowSort(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    selectedSort === option && styles.sortOptionSelected,
                  ]}
                >
                  {option}
                </Text>
                {selectedSort === option && (
                  <Ionicons name="checkmark" size={24} color="#000" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter Modal - Second */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close-outline" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* LEFT MENU */}
                <View style={styles.leftFilterMenu}>
                  {suggestedFilters.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.leftMenuItem,
                        selectedFilterMenu === item.id &&
                          styles.leftMenuItemActive,
                      ]}
                      onPress={() => setSelectedFilterMenu(item.id)}
                    >
                      <Text
                        style={[
                          styles.leftMenuText,
                          selectedFilterMenu === item.id &&
                            styles.leftMenuTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.rightFilterContent}>
                  {selectedFilterMenu === 'suggested' && (
                    <>
                      <Text style={styles.rightTitle}>
                        Choose from the mostly used filters
                      </Text>
                      <View style={styles.chipContainer}>
                        {mostlyUsedFilters.map(item => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.filterChip}
                            onPress={() => {
                              if (item.category === 'delivery') {
                                toggleFilterOption('delivery', item.label);
                              } else if (item.category === 'color') {
                                toggleFilterOption('color', item.label);
                              } else if (item.category === 'discount') {
                                toggleFilterOption('discount', item.label);
                              }
                            }}
                          >
                            <Text>{item.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}

                  {selectedFilterMenu === 'gender' && (
                    <>
                      <Text style={styles.rightTitle}>Gender</Text>
                      {renderFilterOptions('gender')}
                    </>
                  )}

                  {selectedFilterMenu === 'price' && (
                    <>
                      <Text style={styles.rightTitle}>Price</Text>
                      <View style={styles.priceRange}>
                        <View style={styles.priceInputContainer}>
                          <Text style={styles.priceLabel}>From</Text>
                          <View style={styles.priceInputWrapper}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                              style={styles.priceInput}
                              placeholder="0"
                              value={priceFrom}
                              onChangeText={setPriceFrom}
                              keyboardType="numeric"
                              placeholderTextColor="#999"
                            />
                          </View>
                        </View>
                        <View style={styles.priceInputContainer}>
                          <Text style={styles.priceLabel}>To</Text>
                          <View style={styles.priceInputWrapper}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                              style={styles.priceInput}
                              placeholder="1000"
                              value={priceTo}
                              onChangeText={setPriceTo}
                              keyboardType="numeric"
                              placeholderTextColor="#999"
                            />
                          </View>
                        </View>
                      </View>
                    </>
                  )}

                  {selectedFilterMenu === 'brand' && (
                    <>
                      <Text style={styles.rightTitle}>Brand</Text>
                      {renderFilterOptions('brand')}
                    </>
                  )}

                  {selectedFilterMenu === 'size' && (
                    <>
                      <Text style={styles.rightTitle}>Size</Text>
                      {renderFilterOptions('size')}
                    </>
                  )}

                  {selectedFilterMenu === 'color' && (
                    <>
                      <Text style={styles.rightTitle}>Color</Text>
                      {renderFilterOptions('color')}
                    </>
                  )}

                  {selectedFilterMenu === 'discounts' && (
                    <>
                      <Text style={styles.rightTitle}>Discounts</Text>
                      {renderFilterOptions('discount')}
                    </>
                  )}

                  {selectedFilterMenu === 'delivery' && (
                    <>
                      <Text style={styles.rightTitle}>Delivery Time</Text>
                      {renderFilterOptions('delivery')}
                    </>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearButtonText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  resultsCount: {
    color: '#007BFF',
    fontWeight: '600',
  },
  searchKeyword: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  stickyHeader: {
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    zIndex: 1000,
    elevation: 10,
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
    paddingTop: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 4,
  },
  cardContent: {
    flex: 1,
    marginTop: 8,
  },
  brandName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  // Add to Bag Button Styles
  addToBagButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  addToBagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterChipText: {
    fontSize: 13,
    color: '#333',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  priceRange: {
    flexDirection: 'row',
    gap: 16,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 38,
    backgroundColor: '#3004f4',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#000',
  },
  sortOptionSelected: {
    fontWeight: '600',
  },
  leftFilterMenu: {
    width: 120,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
  },
  leftMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  leftMenuItemActive: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#4B4BF9',
  },
  leftMenuText: {
    fontSize: 14,
    color: '#555',
  },
  leftMenuTextActive: {
    color: '#4B4BF9',
    fontWeight: '600',
  },
  rightFilterContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  rightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ProductsScreen;
