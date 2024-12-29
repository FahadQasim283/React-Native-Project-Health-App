import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { auth, DatabaseService } from "./../services/firebaseConfig";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [healthTracking, setHealthTracking] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: "",
    mood: "",
    sleep_hours: "",
    activities: "",
    symptoms: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const users = await DatabaseService.getUsers();
      const userArray = Object.values(users);
      const currentUser = userArray.find(
        (user) => user.id === auth.currentUser?.uid
      );
      if (currentUser) {
        setUserData(currentUser);
        setHealthTracking(currentUser.health_tracking || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAddHealthEntry = () => {
    if (!newEntry.date || !newEntry.mood || !newEntry.sleep_hours) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const updatedHealthTracking = [
      ...healthTracking,
      {
        ...newEntry,
        activities: newEntry.activities.split(",").map((a) => a.trim()),
        symptoms: newEntry.symptoms.split(",").map((s) => s.trim()),
      },
    ];

    setHealthTracking(updatedHealthTracking);
    setNewEntry({
      date: "",
      mood: "",
      sleep_hours: "",
      activities: "",
      symptoms: "",
    });
    setModalVisible(false);

    // Update the database
    const updatedUserData = {
      ...userData,
      health_tracking: updatedHealthTracking,
    };
    DatabaseService.updateUser(auth.currentUser?.uid, updatedUserData)
      .then(() => {
        setUserData(updatedUserData);
      })
      .catch((error) =>
        console.error("Error updating health tracking:", error)
      );
  };

  const renderHealthTrackingEntry = (entry, index) => (
    <View key={index} style={styles.healthEntry}>
      <Text>Date: {entry.date}</Text>
      <Text>Mood: {entry.mood}</Text>
      <Text>Sleep Hours: {entry.sleep_hours}</Text>
      <Text>Activities: {entry.activities.join(", ") || "None"}</Text>
      <Text>Symptoms: {entry.symptoms.join(", ") || "None"}</Text>
    </View>
  );

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text>Age: {userData.age}</Text>
        <Text>Location: {userData.location}</Text>
      </View>

      {/* Goals Section */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Personal Goals</Text>
        {(userData.goals || []).map((goal, index) => (
          <Text key={index} style={styles.goalText}>
            • {goal}
          </Text>
        ))}
      </View>

      {/* Health Tracking Section */}
      <View style={styles.healthTrackingSection}>
        <Text style={styles.sectionTitle}>Health Tracking</Text>
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addEntryButtonText}>+ Add New Entry</Text>
        </TouchableOpacity>

        {healthTracking.length > 0 ? (
          healthTracking.map(renderHealthTrackingEntry)
        ) : (
          <Text>No health tracking entries yet</Text>
        )}
      </View>

      {/* Add Entry Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Health Entry</Text>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              style={styles.input}
              value={newEntry.date}
              onChangeText={(text) => setNewEntry({ ...newEntry, date: text })}
            />
            <TextInput
              placeholder="Mood"
              style={styles.input}
              value={newEntry.mood}
              onChangeText={(text) => setNewEntry({ ...newEntry, mood: text })}
            />
            <TextInput
              placeholder="Sleep Hours"
              style={styles.input}
              value={newEntry.sleep_hours}
              keyboardType="numeric"
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, sleep_hours: text })
              }
            />
            <TextInput
              placeholder="Activities (comma-separated)"
              style={styles.input}
              value={newEntry.activities}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, activities: text })
              }
            />
            <TextInput
              placeholder="Symptoms (comma-separated)"
              style={styles.input}
              value={newEntry.symptoms}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, symptoms: text })
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddHealthEntry}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
  },
  goalsSection: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  healthTrackingSection: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
  },
  healthEntry: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  addEntryButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  addEntryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
    padding: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
