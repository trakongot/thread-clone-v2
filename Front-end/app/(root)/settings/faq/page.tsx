'use client';
import { useState } from 'react';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Lưu trạng thái câu hỏi đang mở

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const faqItems = [
    {
      question: 'How do I create a new thread on Threads?',
      answer:
        "To create a new thread, click on the 'Create Thread' button on the main feed page. Enter your title and content, then click 'Post' to share your thread with the community.",
    },
    {
      question: 'How can I edit my thread after posting?',
      answer:
        "To edit a thread, go to your thread and click on the 'Edit' button located at the top of your post. Make your changes and click 'Save' to update the thread.",
    },
    {
      question: 'How do I delete a thread I posted?',
      answer:
        "To delete a thread, click on the 'Delete' button located under your post. You will be asked to confirm the deletion, and once confirmed, the thread will be permanently removed.",
    },
    {
      question: 'Can I reply to threads from other users?',
      answer:
        "Yes, you can reply to any thread by clicking on the 'Reply' button under the thread. Type your response and press 'Post Reply' to add your comment.",
    },
    {
      question: 'How do I report inappropriate threads or comments?',
      answer:
        "To report a thread or comment, click on the three dots (more options) next to the post and select 'Report'. You will be prompted to choose a reason for the report and submit it.",
    },
    {
      question: 'How do I save a thread to my profile?',
      answer:
        "To save a thread, click the 'Save' button located at the bottom of the thread. The thread will be added to your saved items, which you can access from your profile.",
    },
    {
      question: 'How can I search for threads by keyword or tag?',
      answer:
        'Use the search bar at the top of the page to enter a keyword or hashtag. Threads matching the keyword or tag will appear in the search results.',
    },
    {
      question: 'How can I follow other users on Threads?',
      answer:
        "To follow a user, go to their profile page and click the 'Follow' button. You will start receiving updates from them in your feed.",
    },
    {
      question: 'Can I share a thread with my friends?',
      answer:
        "Yes, you can share any thread by clicking the 'Share' button and selecting how you want to share the link (via social media, email, or a direct link).",
    },
    {
      question: 'How do I manage my notifications on Threads?',
      answer:
        "To manage your notifications, go to your account settings and click on 'Notifications'. Here, you can customize which types of notifications you receive (e.g., replies, follows, mentions).",
    },
  ];

  return (
    <div className="mx-auto  p-24">
      <div className="mb-16">
        <h1 className=" text-center text-3xl font-bold leading-[3.25rem] text-gray-900">
          Frequently asked questions
        </h1>
      </div>
      <div data-accordion="default-accordion">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className=" rounded-2xl border-b border-solid border-gray-200 p-6 transition-all duration-500 hover:bg-indigo-50"
          >
            <button
              className=" group inline-flex w-full items-center justify-between text-left leading-8 text-gray-900 transition duration-500 hover:text-indigo-600"
              aria-controls={`basic-collapse-${index}`}
              onClick={() => toggleAccordion(index)}
            >
              <h5>{item.question}</h5>
              <svg
                className={`text-gray-500 transition duration-500 group-hover:text-indigo-600 ${activeIndex === index ? 'rotate-180' : ''}`}
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              id={`basic-collapse-${index}`}
              className={`w-full overflow-hidden px-0 transition-all duration-500 ${activeIndex === index ? 'max-h-[250px] py-4' : 'max-h-0 py-0'}`}
              aria-labelledby={`basic-heading-${index}`}
            >
              <p className="text-base leading-6 text-gray-900">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
