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
        <Text style={styles.title}> To Do Lists</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter a to-do"
        value={input}
        onChangeText={setInput}
      />
      <Button title={editingId ? "Update To-Do" : "Add To-Do"} onPress={addTodo} />
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
              <TextInput
                style={styles.input}
                value={selectedTodo.text}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={selectedTodo.description || ''}
                onChangeText={text => setSelectedTodo({...selectedTodo, description: text})}
              />
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{selectedTodo.date || 'Select Date'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTimePicker(true)}
              >
                <Text>{selectedTodo.time || 'Select Time'}</Text>
              </TouchableOpacity>
              <Button title="Save" onPress={saveDetails} />
              <Button title="Close" onPress={() => setIsModalVisible(false)} />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  taskLogo: {
    width: 16,
    height: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start of the cross axis
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoTextContainer: {
    flex: 1,
    marginEnd: 15,
  },
  todoText: {
    fontSize: 18,
    flexWrap: 'wrap', // Allows text to wrap if needed
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  deleteButton: {
    width: 20,
    height: 20,
  },
  viewButton: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
});
