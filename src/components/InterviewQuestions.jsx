import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../store/questionPackStore";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const InterviewQuestions = ({ packId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const { solvedQ, addQuestions } = useUserStore();

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/pack/68db8371819aaa6b96fbbee9/questions`);
        setQuestions(res.data.pack.questions || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [packId]);

  if (loading) return <p className="text-center mt-10">Loading Questions...</p>;

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (!transcript.trim()) return alert("Please provide an answer before continuing");
    // Save answer to Zustand store
    addQuestions({
      questionId: currentQuestion._id,
      userAnswer: transcript,
    });
    resetTranscript();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Add current answer if not added
      if (transcript.trim()) {
        addQuestions({
          questionId: currentQuestion._id,
          userAnswer: transcript,
        });
      }

      const userAnswers = solvedQ;
      const res = await axios.post(`/api/packs/${packId}/submit`, { answers: userAnswers });
      alert("Submitted! Feedback: " + JSON.stringify(res.data.purchasedPack));
    } catch (err) {
      console.error(err);
      alert("Error submitting answers");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1} / {questions.length}</h2>
      <p className="text-lg mb-6">{currentQuestion.questionText}</p>

      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-2">Your Answer (via Voice):</p>
        <textarea
          value={transcript}
          readOnly
          rows={5}
          className="w-full p-3 border rounded-lg resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={SpeechRecognition.startListening}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {listening ? "Listening..." : "Start Voice"}
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;
