import axios from 'axios'
// import React, { useState, useContext, useEffect } from 'react'
// useEffect is used at initial development to check the app
// but after using the handleSubmit funtion on button no need to use that
import React, { useContext, useState } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempUrl =
  'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  // used for the form which hold initial questions
  const [waiting, setWaiting] = useState(true)
  // load during fetching
  const [loading, setLoading] = useState(false)
  // data stored in the state
  const [questions, setQuestions] = useState([])
  // used for next question and answer calculation
  const [index, setIndex] = useState(0)
  // hold number of correct answers
  const [correct, setCorrect] = useState(0)
  // show error message
  const [error, setError] = useState(false)
  // used for set value in form
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
  })
  // modal open or close after finishing all questions
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)
    const response = await axios(url).catch((err) => console.log(err))
    if (response) {
      const data = response.data.results
      // data hold the questions set array
      if (data.length > 0) {
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1
      // if index is the last number then this condition open the
      // modal set the index 0
      if (index > questions.length - 1) {
        openModal()
        return 0
      } else {
        return index
      }
    })
  }
  // with is checkAnswer function we can check the answer
  // and whatever the answer is correct or not we can
  // go to the next question with the call of nexeQuestion() function
  const checkAnswer = (value) => {
    // value is the boolian value it checks in the 
    // button is the answer is correct or not
    if (value) {
      setCorrect((oldState) => oldState + 1)
    }
    nextQuestion()
  }
// it set the modalOpen value to true so the modal will open
  const openModal = () => {
    setIsModalOpen(true)
  }
  // it set the modalOpen value to false so the modal will close
  // and open the quiz form again and set some initial values
  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }
  // change the value of quiz object with each change in value
  // controled input system (important)
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setQuiz({ ...quiz, [name]: value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // destructure the value from quiz object to buid the url
    const { amount, category, difficulty } = quiz

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`
    // call the fetchQuestions and no need to use useEffect for fetching
    
    fetchQuestions(url)
  }

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
// test comment