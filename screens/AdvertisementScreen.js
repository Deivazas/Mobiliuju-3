import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Modal, StyleSheet, SafeAreaView, Alert, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addAdvertisement, deleteAdvertisement, editAdvertisement } from '../redux/actions';

const AdvertisementScreen = () => {
  const dispatch = useDispatch();
  const advertisements = useSelector((state) => state.advertisements);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedAdvertisement, setEditedAdvertisement] = useState({});
  
  const fallAnim = new Animated.Value(-1000); // Initial position above the screen

  useEffect(() => {
    Animated.timing(fallAnim, {
      toValue: 0,
      duration: 1000, // You can adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fallAnim]);

  const handleAddAdvertisement = () => {
    if (name.trim() !== '' && description.trim() !== '' && price.trim() !== '') {
      const parsedPrice = parseInt(price, 10);

      if (!isNaN(parsedPrice)) {
        dispatch(
          addAdvertisement({
            id: Date.now(),
            name,
            description,
            price: parsedPrice,
          })
        );
        setIsModalVisible(false);
        setName('');
        setDescription('');
        setPrice('');
      } else {
        alert('Please enter a valid integer for the price.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditAdvertisement = (advertisement) => {
    setEditedAdvertisement(advertisement);
    setName(advertisement.name || '');
    setDescription(advertisement.description || '');
    setPrice(advertisement.price ? advertisement.price.toString() : '');
    setEditModalVisible(true);
  };

  const handleSaveEditAdvertisement = () => {
    const updatedAdvertisement = {
      ...editedAdvertisement,
      name: name === undefined ? editedAdvertisement.name : name,
      description:
        description === undefined ? editedAdvertisement.description : description,
      price: price === '' ? undefined : parseInt(price, 10),
    };

    const index = advertisements.findIndex(
      (ad) => ad.id === editedAdvertisement.id
    );

    if (index !== -1) {
      const updatedAdvertisements = [...advertisements];
      updatedAdvertisements[index] = updatedAdvertisement;

      dispatch(editAdvertisement(updatedAdvertisements));

      setEditModalVisible(false);
      setName('');
      setDescription('');
      setPrice('');
    }
  };

  const handleDeleteAdvertisement = (id) => {
    Alert.alert(
      'Delete Advertisement',
      'Are you sure you want to delete this advertisement?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteAdvertisement(id));
          },
        },
      ],
      { cancelable: false }
    );
  };
  const AdvertisementItem = ({ item, onEdit, onDelete }) => {
    const slideAnim = useRef(new Animated.Value(1)).current;
  
    const handleDelete = () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After the animation is complete, trigger the delete action
        onDelete();
      });
    };
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY: fallAnim }] }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Advertisement Screen</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add Advertisement</Text>
          </TouchableOpacity>

          <FlatList
            data={advertisements}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.advertisementContainer}>
                <Text style={styles.advertisementText}>Name: {item.name}</Text>
                <Text style={styles.advertisementText}>Description: {item.description}</Text>
                <Text style={styles.advertisementText}>Price: {item.price}</Text>

                <View style={styles.editDeleteContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditAdvertisement(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAdvertisement(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.header}>Enter Advertisement Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAdvertisement}
            >
              <Text style={styles.buttonText}>Add Advertisement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={editModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.header}>Edit Advertisement</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSaveEditAdvertisement}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  advertisementContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  advertisementText: {
    color: '#333',
    fontSize: 16,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdvertisementScreen;
