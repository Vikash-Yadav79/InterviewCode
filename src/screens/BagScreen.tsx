import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromBag,
} from '../store/bagSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BagScreen = ({ navigation }: any) => {
  const bagItems = useSelector((state: RootState) => state.bag.items);
  const dispatch = useDispatch();

  // State for selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const getTotalPrice = () => {
    return bagItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getOriginalPrice = (price: number) => {
    const markup = 1 + (0.3 + Math.random() * 0.4);
    return (price * markup).toFixed(0);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === bagItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(bagItems.map(item => item.id));
    }
  };

  const getItemDescriptions = useMemo(() => {
    const descriptions = [
      'Premium quality fabric',
      'Comfortable fit',
      'Durable material',
      'Stylish design',
      'Perfect for everyday wear',
      'High quality craftsmanship',
      'Trendy and fashionable',
      'Breathable fabric',
    ];

    return (id: number) => {
      const index1 = (id * 3) % descriptions.length;
      const index2 = (id * 7) % descriptions.length;
      return {
        desc1: descriptions[index1],
        desc2: descriptions[index2],
      };
    };
  }, []);

  const isAllSelected =
    bagItems.length > 0 && selectedItems.length === bagItems.length;

  if (bagItems.length === 0) {
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
          <Text style={styles.headerTitle}>Bag</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>OOPS 😂</Text>
          <Text style={styles.emptyTitle}>Your bag is empty.</Text>

          {/* Bag Icon */}
          <View style={styles.bagIconContainer}>
            <Ionicons name="bag-outline" size={80} color="#ccc" />
          </View>

          <TouchableOpacity style={styles.addItemsButton}>
            <Text style={styles.addItemsButtonText}>
              Add items to your bag now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startShoppingButton}>
            <Text style={styles.startShoppingButtonText}>Start shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
        <Text style={styles.headerTitle}>Bag</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.deliverySection}>
        <View style={styles.deliveryHeader}>
          <View style={styles.deliveryLeft}>
            <Ionicons name="time-outline" size={20} color="#000" />
            <Text style={styles.deliveryTitle}>Delivering in just 60 min</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-down-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.deliveryAddress}>
          Full address - 29 Aparna Complex, Gurgaon...
        </Text>
      </View>

      <View style={styles.freeDeliveryBanner}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#460ee2" />
        <Text style={styles.freeDeliveryText}>
          Yay! Your order is eligible for FREE delivery.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.selectAllContainer}
        onPress={toggleSelectAll}
      >
        <View
          style={[
            styles.selectAllCheckbox,
            isAllSelected && styles.checkboxSelected,
          ]}
        >
          {isAllSelected && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        <Text style={styles.selectAllText}>Select all items</Text>
      </TouchableOpacity>

      <FlatList
        data={bagItems}
        renderItem={({ item }) => {
          const originalPrice = getOriginalPrice(item.price);
          const descriptions = getItemDescriptions(item.id);
          const isSelected = selectedItems.includes(item.id);

          return (
            <View style={styles.bagItem}>
              <TouchableOpacity
                style={styles.itemCheckbox}
                onPress={() => toggleSelectItem(item.id)}
              >
                <View
                  style={[
                    styles.checkboxCircle,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="contain"
                onError={e => console.log('Image error:', e.nativeEvent.error)}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemDescription} numberOfLines={1}>
                  {descriptions.desc1}
                </Text>
                <Text style={styles.itemDescription} numberOfLines={1}>
                  {descriptions.desc2}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.discountedPrice}>
                    ₹{item.price.toFixed(0)}
                  </Text>
                  <Text style={styles.originalPrice}>₹{originalPrice}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.tryInBuyButton}>
                    <Text style={styles.tryInBuyText}>TRYNBUY</Text>
                  </TouchableOpacity>
                  <View style={styles.quantityBox}>
                    {item.quantity === 1 ? (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => dispatch(removeFromBag(item.id))}
                      >
                        <Ionicons name="trash-outline" size={18} color="#999" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => dispatch(decreaseQuantity(item.id))}
                      >
                        <Ionicons name="remove" size={16} color="#000" />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => dispatch(increaseQuantity(item.id))}
                    >
                      <Ionicons name="add" size={16} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.selectedCount}>
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}{' '}
            selected
          </Text>
          <Text style={styles.totalPrice}>₹{getTotalPrice().toFixed(0)}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Proceed to pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 35,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 24,
  },
  bagIconContainer: {
    marginBottom: 32,
  },
  addItemsButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  addItemsButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  startShoppingButton: {
    backgroundColor: '#4342FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  startShoppingButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Delivery Section
  deliverySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
    marginTop: 4,
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 14,
    gap: 8,
    borderRadius: 8,
  },
  freeDeliveryText: {
    flex: 1,
    fontSize: 13,
    color: '#3b0be8',
    fontWeight: '400',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  selectAllCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bagItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  itemCheckbox: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tryInBuyButton: {
    backgroundColor: '#2202da',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tryInBuyText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#000',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  proceedButton: {
    backgroundColor: '#2a07f3',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BagScreen;
