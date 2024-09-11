import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [input, setInput] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const addTodo = () => {
    if (input.trim().length === 0) {
      Alert.alert('Input Error', 'Please enter a to-do item');
      return;
    }

    if (editingId) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: input } : todo
      ));
      setEditingId(null);
    } else {
      const newTodo: Todo = { id: Date.now().toString(), text: input, done: false };
      setTodos([...todos, newTodo]);
    }
    setInput('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setInput(todoToEdit.text);
      setEditingId(id);
    }
  };

  const markAsDone = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const openModal = (id: string) => {
    const todoToView = todos.find(todo => todo.id === id);
    if (todoToView) {
      setSelectedTodo(todoToView);
      setIsModalVisible(true);
    }
  };

  const saveDetails = () => {
    if (selectedTodo) {
      setTodos(todos.map(todo =>
        todo.id === selectedTodo.id ? { ...todo, description: selectedTodo.description, time: selectedTodo.time, date: selectedTodo.date } : todo
      ));
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
          date: formattedDate
        });
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${period}`;
      if (selectedTodo) {
        setSelectedTodo({
          ...selectedTodo,
          time: formattedTime
        });
      }
    }
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
        <TouchableOpacity onPress={() => openModal(item.id)}>
          <Image
            source={require("@/assets/images/view.png")}
            style={styles.viewButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editTodo(item.id)}>
          <Image
            source={require("@/assets/images/edit.png")}
            style={styles.editButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Image
            source={require("@/assets/images/delete.png")}
            style={styles.deleteButton}
          />
        </TouchableOpacity>
      </View>
    </View>
  );  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/bars.png")}
          style={styles.taskLogo}
        />
        <Text style={styles.title}> To Do List</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={input}
        onChangeText={setInput}
      />
      <Button title={editingId ? "Update Task" : "Add Task"} onPress={addTodo} />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

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
                style={styles.input}
                placeholder="Description"
                value={selectedTodo.description || ''}
                onChangeText={text => setSelectedTodo({...selectedTodo, description: text})}
              />
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>{selectedTodo.date || 'Select Date'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>{selectedTodo.time || 'Select Time'}</Text>
              </TouchableOpacity>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveDetails}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F8', // Softer background color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
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
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
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
    color: '#333',
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    tintColor: '#007BFF',
  },
  deleteButton: {
    width: 24,
    height: 24,
    tintColor: '#FF3B30',
  },
  viewButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    tintColor: '#4CD964',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10, // Added marginRight to create space between the buttons
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF3B30', // Red background color
    padding: 15, // Reduced padding to match the save button
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
});
