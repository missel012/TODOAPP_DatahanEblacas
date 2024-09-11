import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ImageBackground,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  description?: string;
  time?: string;
  date?: string;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSortModalVisible, setSortModalVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const addTodo = () => {
    if (input.trim().length === 0) {
      Alert.alert("Input Error", "Please enter a to-do item");
      return;
    }

    if (editingId) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: input } : todo
        )
      );
      setEditingId(null);
    } else {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: input,
        done: false,
      };
      setTodos([...todos, newTodo]);
    }
    setInput("");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setInput(todoToEdit.text);
      setEditingId(id);
    }
  };

  const markAsDone = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const openModal = (id: string) => {
    const todoToView = todos.find((todo) => todo.id === id);
    if (todoToView) {
      setSelectedTodo(todoToView);
      setIsModalVisible(true);
    }
  };

  const saveDetails = () => {
    if (selectedTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === selectedTodo.id
            ? {
                ...todo,
                description: selectedTodo.description,
                time: selectedTodo.time,
                date: selectedTodo.date,
              }
            : todo
        )
      );
      setIsModalVisible(false);
      setSelectedTodo(null);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toDateString();
      if (selectedTodo) {
        setSelectedTodo({
          ...selectedTodo,
          date: formattedDate,
        });
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
      if (selectedTodo) {
        setSelectedTodo({
          ...selectedTodo,
          time: formattedTime,
        });
      }
    }
  };

  const sortTodos = (criterion: string) => {
    let sortedTodos: Todo[] = [];

    switch (criterion) {
      case "name":
        sortedTodos = [...todos].sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "date":
        sortedTodos = [...todos].sort((a, b) =>
          (a.date || "").localeCompare(b.date || "")
        );
        break;
      case "done":
        sortedTodos = [...todos].sort(
          (a, b) => Number(a.done) - Number(b.done)
        );
        break;
    }

    setTodos(sortedTodos);
    setSortModalVisible(false);
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoTextContainer}>
        <TouchableOpacity onPress={() => markAsDone(item.id)}>
          <Text style={[styles.todoText, item.done && styles.todoTextDone]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        {item.done ? (
          // When task is done, "done" button will act like the delete button
          <TouchableOpacity onPress={() => deleteTodo(item.id)}>
            <Image
              source={require("../../assets/images/done.png")} // Adjust the path if necessary
              style={styles.doneButton}
            />
          </TouchableOpacity>
        ) : (
          // Show view, edit, and delete buttons if the task is not done
          <>
            <TouchableOpacity onPress={() => openModal(item.id)}>
              <Image
                source={require("../../assets/images/view.png")}
                style={styles.viewButton}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editTodo(item.id)}>
              <Image
                source={require("../../assets/images/edit.png")}
                style={styles.editButton}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Image
                source={require("../../assets/images/delete.png")}
                style={styles.deleteButton}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")} // Adjust the path if necessary
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/bars.png")} // Adjust the path if necessary
          style={styles.taskLogo}
        />
        <Text style={styles.title}> To Do List</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Image
            source={require("../../assets/images/sort.png")} // Adjust the path if necessary
            style={styles.taskLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteAllDoneButton}
          onPress={() => {
            // Function to delete all done todos
            setTodos(todos.filter((todo) => !todo.done));
          }}
        >
          <Image
            source={require("../../assets/images/deleteAllDone.png")} // Adjust the path if necessary
            style={styles.taskLogo}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={input}
        multiline={true}
        onChangeText={setInput}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>
          {editingId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {isSortModalVisible && (
        <Modal
          visible={isSortModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort</Text>

              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => sortTodos("name")}
              >
                <Text style={styles.sortOptionText}>by Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => sortTodos("date")}
              >
                <Text style={styles.sortOptionText}>by Date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => sortTodos("done")}
              >
                <Text style={styles.sortOptionText}>by Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortModalCloseButton} // Use new style here
                onPress={() => setSortModalVisible(false)}
              >
                <Text style={styles.sortModalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selectedTodo && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setIsModalVisible(false);
            setSelectedTodo(null);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTodo.text}</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Description"
                value={selectedTodo.description || ""}
                multiline={true}
                onChangeText={(text) =>
                  setSelectedTodo({ ...selectedTodo, description: text })
                }
              />
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={
                    selectedTodo?.date
                      ? styles.dateTimeTextSelected
                      : styles.dateTimeText
                  }
                >
                  {selectedTodo?.date || "Select Date"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text
                  style={
                    selectedTodo?.time
                      ? styles.dateTimeTextSelected
                      : styles.dateTimeText
                  }
                >
                  {selectedTodo?.time || "Select Time"}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveDetails}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date(selectedTodo?.date || Date.now())}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date(selectedTodo?.time || Date.now())}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F8", // Softer background color
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Distribute space between items
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: "#1E2A5E",
    padding: 15,
    borderRadius: 10, // Softer edges
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Optional margin to separate from the input
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskLogo: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    textAlignVertical: "center",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoTextContainer: {
    flex: 1,
    marginEnd: 15,
  },
  todoText: {
    fontSize: 18,
    color: "#333",
  },
  todoTextDone: {
    textDecorationLine: "line-through",
    color: "#A9A9A9",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    tintColor: "#4CD964",
  },
  editButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    tintColor: "#007BFF",
  },
  deleteButton: {
    width: 24,
    height: 24,
    tintColor: "#FF3B30",
  },
  doneButton: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333", // Default color when no date or time is selected
  },
  dateTimeTextSelected: {
    fontSize: 16,
    color: "#0BBB7E", // Green color when date or time is selected
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#1E2A5E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#A02334", // Red background color
    padding: 15, // Reduced padding to match the save button
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10, // Added marginRight to create space between the buttons
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  sortButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto", // Push the sort button to the right
  },
  sortOptionButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333",
  },
  sortModalCloseButton: {
    backgroundColor: "#A02334", // Red background color
    padding: 15, // Adjusted padding for the sort modal close button
    borderRadius: 10, // Slightly smaller radius
    alignItems: "center",
    justifyContent: "center", // Center text inside button
  },
  sortModalCloseButtonText: {
    color: "#FFF",
    fontSize: 14, // Smaller font size for the sort modal close button
    fontWeight: "bold",
  },
  deleteAllDoneButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
