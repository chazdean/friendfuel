import { collection, addDoc, Timestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig"; // Adjust the import if necessary

const questions = [
  {
    text: "What’s the first thing you noticed about me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What do you think is the hardest part of what I do for a living?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Which reality show do you think I’d most likely watch?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "If Myspace were still a thing, what would my profile song be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "On a scale of 1-10, how messy do you think my car is? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What’s one trait from your parents you’d like to let go of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "Between us, who seems like the better texter? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What was your first impression of me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "Do I look like a kind person? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "Do you think I’d get a name tattooed on myself? Why or why not?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "If you were to buy me a present, knowing only what I look like, what would it be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "What about me intrigues you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "What does my Instagram say about me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "What was your first impression of me online vs. in real life?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "Do you think plants thrive or die in my care? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "Am I more creative or analytical? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What subject do you think I excelled at in school? Did I fail any?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "Finish this sentence: 'Just by looking at you, I’d think...'",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "Do you think I fall in love easily? Why or why not?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What do you think I’m most likely to splurge on?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "How many speeding tickets do you think I’ve had?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "How would you describe my type in three words?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "Do you think I’ve been fired from a job? If so, why?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What did you think of my first message?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What’s one thing you’ll never say no to?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "As a child, what do you think I wanted to be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "Do I seem like a morning person or a night owl?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "Do you usually connect with people like me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "Do you think I was popular in school? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "What compliment do you think I hear the most?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "What’s a piece of advice that has stuck with you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "What movie or book am I most like, and why?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "Do you think I’d be on time or late to events? Explain.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "Do I intimidate you? Why or why not?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What does my phone wallpaper say about me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "Do you think I’ve checked an ex’s phone for evidence?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "Do I remind you of anyone?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What song lyrics come to mind when you think of me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Are you lying to yourself about anything?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "What questions are you trying to answer in life right now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "What’s been your happiest memory this past year?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What do you crave more of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "Have you changed your mind about anything recently?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What’s your earliest memory of happiness?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "What lesson took you the longest to unlearn?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "When was the last time you surprised yourself?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "Describe the feeling of being in love in one word.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "Has a stranger ever changed your life?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "What insecurity holds you back the most?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "How could you become a better person?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "What title would you give this chapter in your life?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "What’s the worst non-physical pain you’ve experienced?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What’s something about yourself you wouldn’t want to change?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "What’s your first love’s name and why did you fall for them?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What would your younger self not believe about your life now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What’s your mom’s name and her most beautiful quality?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Are you more afraid of failure or success? Why?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "What dream have you let go of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "What’s my fast food drive-thru order?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "Who would you like to get to know better, and why?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What have you been hiding all these years?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What part of your life works, and what part hurts?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "Do you think your self-image matches how others see you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "What’s the nicest thing a friend or partner has done for you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "What’s the most embarrassing thing on a date?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "What could you have done better in past relationships?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "Are you missing anyone right now? Do they miss you too?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "Do I intimidate others? Why or why not?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "When asked, 'How are you?' do you answer truthfully?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "How are you, really?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What has being single taught you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "What’s your least favorite question on a date? What do you wish you were asked more?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What’s the most unexplainable thing that’s happened to you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What’s your dad’s name, and tell me one thing about him.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Describe your perfect day.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  }, // ... Previous entries from earlier response
  {
    text: "What’s a goal or dream of mine you’d like to see me achieve?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What dating advice would you give your younger self?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What did the people who raised you teach you about love?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "How old do you feel emotionally?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "Would I find your ex on your social media feed? Why or why not?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "Is there an image of yourself you wish you could let go of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "Describe your perfect date.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "What are you passionate about?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "Who’s your comfort person?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "If you had it your way, where would you be and with whom?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "If you could choose a song that represents me, what would it be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "Do you think I’ve been in love before?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "What are you feeling most today?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What limiting belief holds you back?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What aren’t you giving enough time to right now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "When did you last feel truly understood? Who understood you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "When was the last time you cried?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "What’s my superpower?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "Admit something.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What about me surprised you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "How would you describe me to a stranger?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "Do you have a Netflix recommendation for me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "What do you think our most important similarities are?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "Based on what you’ve learned, what book would you recommend for me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "What’s one thing I could do to improve my life?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "How can I help you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "What do I need to hear right now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "What comes easily to me that’s hard for others?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "What parts of yourself do you see in me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "Where am I most qualified to give advice?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "What would be the perfect gift for me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What do I need to hear right now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "How does one earn your vulnerability?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Does my social media portray me accurately?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "What would you remember about me if we lost contact?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "When this game is over, what will you remember about me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What’s my weakness?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What do you admire most about me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What’s my most attractive quality that isn’t physical?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "What can we create together?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "Dare your partner to try something out of their comfort zone.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "What’s one lesson you’ll take from our conversation?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "What do you think I fear most?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "How can someone show you love without saying it?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "What should I let go of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "What’s the hardest thing about me for you to understand?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "If we were a band, what would our name be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What has this conversation taught you about yourself?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "What’s my defining characteristic?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What can we create together?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What do you suggest I should let go of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "Why do you think we met?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "How do our personalities complement each other?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "What are you still trying to prove to yourself?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What should I know about myself that I may not be aware of?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "What would make you feel closer to me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "How would our lives be different if we hadn’t met?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "Choose one word to describe our connection.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "What’s something that reminds you of me?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "Has our connection influenced your growth?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
  {
    text: "Am I what you expected?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_12.png?alt=media&token=fbda2baf-a3dc-4567-b316-19e506c26041",
  },
  {
    text: "What’s the biggest obstacle in my life right now?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_13.png?alt=media&token=7e7bdd7f-da1c-4bb0-8f42-b9ef1a5a32d0",
  },
  {
    text: "In one word, describe how you feel now.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_14.png?alt=media&token=94e1dbd1-aae3-4685-9248-bf7ae5d7e0cc",
  },
  {
    text: "Do you believe everyone has a calling? Have I found mine?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_15.png?alt=media&token=6719209d-0b10-4e32-8f76-9254d364d095",
  },
  {
    text: "What’s my biggest lesson to you?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_16.png?alt=media&token=605ff2f7-b959-40a2-b526-2f7392c3a411",
  },
  {
    text: "What’s a challenge we’ve overcome together?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_17.png?alt=media&token=a2abd0fe-d6a7-4a0f-96fe-506ce7ae8b61",
  },
  {
    text: "How do you define friendship?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_18.png?alt=media&token=46d0c8d7-1800-40ce-bd9e-bd4e69e14de8",
  },
  {
    text: "What are you most grateful for in your life?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_1.png?alt=media&token=719c8a9c-187c-4d79-9912-ccbabdbec851",
  },
  {
    text: "What’s something that makes you smile every day?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_2.png?alt=media&token=933ab473-346a-4505-8b01-01132d311d51",
  },
  {
    text: "If you had one message for the world, what would it be?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_3.png?alt=media&token=f8164a8c-937e-48e7-aa43-b83550ab4de3",
  },
  {
    text: "What’s a trait you admire most in others?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_4.png?alt=media&token=be1fe285-b7fb-4c20-a49c-60a5184e6b86",
  },
  {
    text: "What’s something you’re looking forward to?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_5.png?alt=media&token=b97a31bf-cf53-456a-abd7-f1515c591a06",
  },
  {
    text: "What’s a memory you treasure?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_6.png?alt=media&token=51eb7be0-2f93-413e-8f02-33b8d8a9274e",
  },
  {
    text: "Describe your happy place.",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_7.png?alt=media&token=102ec036-be59-4b6e-93bc-e9474d4e19ff",
  },
  {
    text: "What inspires you to be a better person?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_8.png?alt=media&token=3be12675-3222-46ca-bd30-69d36b76414e",
  },
  {
    text: "What’s your life’s motto?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_9.png?alt=media&token=46c4e315-7708-4034-9cb9-4d690dfeea10",
  },
  {
    text: "What do you want to be remembered for?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_10.png?alt=media&token=9acad7f7-e4ae-46ad-858a-d1e88b936cf1",
  },
  {
    text: "What legacy do you want to leave behind?",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/question%20thumbnails%2Fquestion_thumbnail_11.png?alt=media&token=a2e5f911-5b4d-45a3-9a42-63542bde1ed6",
  },
];

export const addQuestionsToFirebase = async () => {
  try {
    const questionsCollection = collection(FIRESTORE_DB, "questions");

    for (let question of questions) {
      await addDoc(questionsCollection, {
        ...question,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }
    console.log("Questions successfully added to Firestore!");
  } catch (error) {
    console.error("Error adding questions: ", error);
  }
};
