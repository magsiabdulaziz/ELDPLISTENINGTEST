/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuestionData, MatchingOption, VocabularyItem, PartNumber } from './types';

export const INSTITUTION_INFO = {
  institution: 'Institute of Emerging Technologies, Sukkur IBA University – Khairpur Campus',
  exam: 'B2 First for Schools',
  component: 'Listening · Mid Term Examination',
  practiceTest: 'Think 2 (Chapters 1–4)',
  courseCode: 'ENG-201 / English Language II',
  instructorEmail: 'magsiabdulaziz.khp@iba-suk.edu.pk',
  timeAllowed: 'Approximately 40 minutes (including 5 minutes’ transfer time)',
  totalMarks: 30,
  totalParts: 4,
};

export const PART_3_MATCHING_OPTIONS: MatchingOption[] = [
  { key: 'A', text: 'It was harder for someone else in my family than for me.' },
  { key: 'B', text: 'I was surprised how quickly I got used to it.' },
  { key: 'C', text: 'I still find one part of it difficult.' },
  { key: 'D', text: 'I regret not preparing for it better.' },
  { key: 'E', text: 'Someone I met made a big difference.' },
  { key: 'F', text: 'It helped me to discover a new interest.' },
  { key: 'G', text: 'I was more worried about it than I needed to be.' },
  { key: 'H', text: 'It changed the way I organise my time.' },
];

export const QUESTIONS_DATA: QuestionData[] = [
  // ==========================================
  // PART 1: Questions 1 - 8 (Multiple Choice)
  // ==========================================
  {
    id: 1,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear two friends talking about a film they have just seen.',
    question: 'What do they agree about?',
    options: [
      { key: 'A', text: 'The villain was the most interesting character.' },
      { key: 'B', text: 'The ending was too predictable.' },
      { key: 'C', text: 'The dialogue sounded unnatural.' },
    ],
    correctAnswer: 'B',
    skillTested: 'Identifying agreement & consensus between speakers',
    evidenceQuote:
      'Girl: "As soon as the hero found the key, I knew exactly how it was going to end." / Boy: "Yeah, that was disappointing. I’d expected some kind of twist, and there wasn’t one. Everything was sorted out far too neatly."',
    explanation: {
      correct:
        'Both speakers agree that the climax was obvious and predictable: the girl says she knew exactly how it would end once the key was found, and the boy agrees it was disappointing because everything was sorted out far too neatly without any twist.',
      distractors: [
        { key: 'A', reason: 'They disagree about the villain: the girl loved him, but the boy found him a bit silly with too much shouting.' },
        { key: 'C', reason: 'They both praise the dialogue rather than finding it unnatural: the girl says it sounded just like real people talking and the boy agrees ("They did").' },
      ],
      examTip: 'Notice agreement tags and how both speakers express disappointment about the ending wrapping up without a twist.',
    },
    dialogue: [
      { speaker: 'Girl', text: 'So, what did you think? I loved the villain – he was so much more interesting than the hero.' },
      { speaker: 'Boy', text: 'Really? I found him a bit silly, to be honest. Too much shouting. But the plot kept me guessing, didn’t it?' },
      { speaker: 'Girl', text: 'Until the last ten minutes. As soon as the hero found the key, I knew exactly how it was going to end.', isEvidence: true },
      { speaker: 'Boy', text: 'Yeah, that was disappointing. I’d expected some kind of twist, and there wasn’t one. Everything was sorted out far too neatly.', isEvidence: true },
      { speaker: 'Girl', text: 'Still, the conversations between the characters were brilliant – they sounded just like real people talking.' },
      { speaker: 'Boy', text: 'They did. Pity about the ending, though.' },
    ],
    audioScript: {
      intro: 'Question 1. You hear two friends talking about a film they have just seen. What do they agree about?',
      extractText:
        'Girl: So, what did you think? I loved the villain – he was so much more interesting than the hero.\nBoy: Really? I found him a bit silly, to be honest. Too much shouting. But the plot kept me guessing, didn’t it?\nGirl: Until the last ten minutes. As soon as the hero found the key, I knew exactly how it was going to end.\nBoy: Yeah, that was disappointing. I’d expected some kind of twist, and there wasn’t one. Everything was sorted out far too neatly.\nGirl: Still, the conversations between the characters were brilliant – they sounded just like real people talking.\nBoy: They did. Pity about the ending, though.',
    },
  },
  {
    id: 2,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a girl talking about how she revised for her exams.',
    question: 'What does she regret?',
    options: [
      { key: 'A', text: 'not starting her revision earlier' },
      { key: 'B', text: 'revising together with her friends' },
      { key: 'C', text: 'not getting enough sleep' },
    ],
    correctAnswer: 'B',
    skillTested: 'Recognizing stated regrets and personal reflections',
    evidenceQuote:
      'Girl: "What I really regret is agreeing to revise with my friends every afternoon. It seemed like a good idea at the time, but we spent most of the time chatting..."',
    explanation: {
      correct:
        'She explicitly states: "What I really regret is agreeing to revise with my friends every afternoon" because they spent most of their time chatting.',
      distractors: [
        { key: 'A', reason: 'She started early in March and stuck to her revision timetable quite well.' },
        { key: 'C', reason: 'She made sure she went to bed at a sensible time this year to avoid the sleepless nights of last year.' },
      ],
      examTip: 'Listen for grammatical structures like "What I really regret is + gerund (-ing)".',
    },
    dialogue: [
      {
        speaker: 'Girl',
        text: 'Everyone told me to make a revision timetable, so I did, and I actually stuck to it quite well – I started revising in March, which is early for me. And I made sure I went to bed at a sensible time, because I remember having sleepless nights before last year’s exams and feeling awful. What I really regret is agreeing to revise with my friends every afternoon. It seemed like a good idea at the time, but we spent most of the time chatting, and I always came home feeling I’d hardly done anything. Next year I’ll try working on my own.',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 2. You hear a girl talking about how she revised for her exams. What does she regret?',
      extractText:
        'Girl: Everyone told me to make a revision timetable, so I did, and I actually stuck to it quite well – I started revising in March, which is early for me. And I made sure I went to bed at a sensible time, because I remember having sleepless nights before last year’s exams and feeling awful. What I really regret is agreeing to revise with my friends every afternoon. It seemed like a good idea at the time, but we spent most of the time chatting, and I always came home feeling I’d hardly done anything. Next year I’ll try working on my own.',
    },
  },
  {
    id: 3,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a man talking about his journey to work.',
    question: 'How does he feel about his new way of travelling?',
    options: [
      { key: 'A', text: 'relieved that it costs him less' },
      { key: 'B', text: 'pleased that it helps him to stay fit' },
      { key: 'C', text: 'glad that it is more reliable' },
    ],
    correctAnswer: 'C',
    skillTested: 'Identifying feelings and core motivations',
    evidenceQuote:
      'Man: "What really makes a difference is that I know exactly when I’ll arrive. No more sitting in queues of motorists, wondering whether I’ll make my nine o’clock meeting."',
    explanation: {
      correct:
        'He is glad that his new journey is reliable and punctual: "What really makes a difference is that I know exactly when I’ll arrive."',
      distractors: [
        { key: 'A', reason: 'He rejects the cost idea: "And it isn’t cheaper, either – the train ticket costs almost as much as the petrol did."' },
        { key: 'B', reason: 'He rejects fitness as his motive: "People assume I did it to get fit, but honestly, I get enough exercise at the weekends."' },
      ],
      examTip: 'Watch how speakers rule out popular assumptions before giving their real motivation.',
    },
    dialogue: [
      {
        speaker: 'Man',
        text: 'I used to drive to the office every day, but the traffic got so bad that I was late at least twice a week, which my boss wasn’t too happy about. So now I take the train and then cycle the last three kilometres. People assume I did it to get fit, but honestly, I get enough exercise at the weekends. And it isn’t cheaper, either – the train ticket costs almost as much as the petrol did. What really makes a difference is that I know exactly when I’ll arrive. No more sitting in queues of motorists, wondering whether I’ll make my nine o’clock meeting.',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 3. You hear a man talking about his journey to work. How does he feel about his new way of travelling?',
      extractText:
        'Man: I used to drive to the office every day, but the traffic got so bad that I was late at least twice a week, which my boss wasn’t too happy about. So now I take the train and then cycle the last three kilometres. People assume I did it to get fit, but honestly, I get enough exercise at the weekends. And it isn’t cheaper, either – the train ticket costs almost as much as the petrol did. What really makes a difference is that I know exactly when I’ll arrive. No more sitting in queues of motorists, wondering whether I’ll make my nine o’clock meeting.',
    },
  },
  {
    id: 4,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a teacher talking to her class about a school trip.',
    question: 'What is she doing?',
    options: [
      { key: 'A', text: 'reminding students of the rules for the trip' },
      { key: 'B', text: 'explaining a change to the arrangements' },
      { key: 'C', text: 'encouraging more students to take part' },
    ],
    correctAnswer: 'B',
    skillTested: 'Identifying communicative function and speaker intent',
    evidenceQuote:
      'Teacher: "...there’s been a change to Friday’s trip... we’ll be going to the science museum instead, and we’ll be leaving at half past eight rather than eight."',
    explanation: {
      correct:
        'Her main purpose is to announce and explain changes to the destination (science museum) and departure time (8:30).',
      distractors: [
        { key: 'A', reason: 'Rules like phones and packed lunches are mentioned, but they "stay the same", so they are not her reason for talking.' },
        { key: 'C', reason: 'She is not encouraging participation; the students are already signed up and just need to hand in permission forms.' },
      ],
      examTip: 'Identify the communicative function in the introductory sentence ("there’s been a change to Friday’s trip").',
    },
    dialogue: [
      {
        speaker: 'Teacher',
        text: 'Right, everyone, listen carefully, because there’s been a change to Friday’s trip. As you know, we were supposed to set off at eight o’clock and visit the castle in the morning. Unfortunately, the castle is closed for repairs that day, so we’ll be going to the science museum instead, and we’ll be leaving at half past eight rather than eight. Everything else stays the same – you still need to bring a packed lunch, and you still aren’t allowed to use your phones on the coach. Oh, and please don’t forget to return your permission forms by Wednesday.',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 4. You hear a teacher talking to her class about a school trip. What is she doing?',
      extractText:
        'Teacher: Right, everyone, listen carefully, because there’s been a change to Friday’s trip. As you know, we were supposed to set off at eight o’clock and visit the castle in the morning. Unfortunately, the castle is closed for repairs that day, so we’ll be going to the science museum instead, and we’ll be leaving at half past eight rather than eight. Everything else stays the same – you still need to bring a packed lunch, and you still aren’t allowed to use your phones on the coach. Oh, and please don’t forget to return your permission forms by Wednesday.',
    },
  },
  {
    id: 5,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a boy talking about his father.',
    question: 'What does the boy say about his father?',
    options: [
      { key: 'A', text: 'He is too strict with his children.' },
      { key: 'B', text: 'He embarrassed him in front of his friends.' },
      { key: 'C', text: 'He has become more relaxed than he used to be.' },
    ],
    correctAnswer: 'C',
    skillTested: 'Identifying past vs present character contrast',
    evidenceQuote:
      'Boy: "When I was younger, my dad was pretty strict... But since my older sister went to university, he’s changed a lot. He lets me stay up later, and last week he even agreed to let me go to a concert in the city with my mates..."',
    explanation: {
      correct:
        'The boy explains that his father has become noticeably more relaxed and permissive since his older sister left for university.',
      distractors: [
        { key: 'A', reason: 'He was strict in the past, but the speaker says he has changed a lot now.' },
        { key: 'B', reason: 'His friends thought his dad was scary when younger, but no embarrassing incident is described.' },
      ],
      examTip: 'Note the contrast markers: "When I was younger... But since my older sister went to university, he’s changed a lot."',
    },
    dialogue: [
      {
        speaker: 'Boy',
        text: 'When I was younger, my dad was pretty strict. We weren’t allowed to watch TV on school nights, and he made us go to bed at nine, even at weekends. My friends used to think he was really scary. But since my older sister went to university, he’s changed a lot. He lets me stay up later, and last week he even agreed to let me go to a concert in the city with my mates, which he would never have done a couple of years ago. My mum says he’s finally realised that we’re growing up. Mind you, he still insists on driving me everywhere!',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 5. You hear a boy talking about his father. What does the boy say about his father?',
      extractText:
        'Boy: When I was younger, my dad was pretty strict. We weren’t allowed to watch TV on school nights, and he made us go to bed at nine, even at weekends. My friends used to think he was really scary. But since my older sister went to university, he’s changed a lot. He lets me stay up later, and last week he even agreed to let me go to a concert in the city with my mates, which he would never have done a couple of years ago. My mum says he’s finally realised that we’re growing up. Mind you, he still insists on driving me everywhere!',
    },
  },
  {
    id: 6,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a girl leaving a voicemail message for a friend.',
    question: 'Why is she calling?',
    options: [
      { key: 'A', text: 'to apologise for something she did' },
      { key: 'B', text: 'to ask her friend for a favour' },
      { key: 'C', text: 'to explain why she can’t meet her friend' },
    ],
    correctAnswer: 'A',
    skillTested: 'Identifying primary purpose of voicemail message',
    evidenceQuote:
      'Girl: "Listen, I feel really bad about yesterday. I shouldn’t have posted that photo of you from the party without asking you first... I’ve taken it down now."',
    explanation: {
      correct:
        'The girl is calling to apologise for uploading a photo from the party without asking first.',
      distractors: [
        { key: 'B', reason: 'She asks about history notes at the very end as a casual aside ("No problem if not"), not the main reason for calling.' },
        { key: 'C', reason: 'She hopes they can still meet at the library as planned.' },
      ],
      examTip: 'Disregard minor closing requests; focus on the initial statement of regret ("I feel really bad about yesterday. I shouldn’t have...").',
    },
    dialogue: [
      {
        speaker: 'Girl',
        text: 'Hi Sofia, it’s Amira. Listen, I feel really bad about yesterday. I shouldn’t have posted that photo of you from the party without asking you first – I honestly thought it was funny, but I can see why you were upset. I’ve taken it down now. Anyway, I know we said we’d meet at the library on Saturday, and I’m still hoping we can, if you’re not too annoyed with me. Oh, and if you’ve still got my history notes, could you bring them? No problem if not. Call me back, OK? Bye.',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 6. You hear a girl leaving a voicemail message for a friend. Why is she calling?',
      extractText:
        'Girl: Hi Sofia, it’s Amira. Listen, I feel really bad about yesterday. I shouldn’t have posted that photo of you from the party without asking you first – I honestly thought it was funny, but I can see why you were upset. I’ve taken it down now. Anyway, I know we said we’d meet at the library on Saturday, and I’m still hoping we can, if you’re not too annoyed with me. Oh, and if you’ve still got my history notes, could you bring them? No problem if not. Call me back, OK? Bye.',
    },
  },
  {
    id: 7,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear a woman on the radio talking about a painter.',
    question: 'What made the painter’s work unusual?',
    options: [
      { key: 'A', text: 'the materials he painted with' },
      { key: 'B', text: 'the places where he painted' },
      { key: 'C', text: 'the colours he chose' },
    ],
    correctAnswer: 'B',
    skillTested: 'Identifying specific factual distinctions in an artist profile',
    evidenceQuote:
      'Woman: "What makes Henri Duval’s work stand out is that he refused to do that [work indoors in studios]. Believe it or not, he painted on the tops of mountains, on fishing boats, even in the middle of busy markets."',
    explanation: {
      correct:
        'His work was unusual because of the outdoor locations where he produced it (mountaintops, boats, markets) rather than working inside a studio.',
      distractors: [
        { key: 'A', reason: 'He used the exact same materials as others: "he used exactly the same oil paints as everyone else."' },
        { key: 'C', reason: 'His colours were ordinary and typical of his era: "His colours weren’t particularly bright – in fact, they were quite dark and heavy, like those of most painters of his generation."' },
      ],
      examTip: 'Notice how the speaker explicitly eliminates materials and colours before highlighting the extraordinary locations.',
    },
    dialogue: [
      {
        speaker: 'Woman',
        text: 'Most painters of that time worked indoors, in studios, because carrying paint around was so difficult. What makes Henri Duval’s work stand out is that he refused to do that. Believe it or not, he painted on the tops of mountains, on fishing boats, even in the middle of busy markets. His colours weren’t particularly bright – in fact, they were quite dark and heavy, like those of most painters of his generation – and he used exactly the same oil paints as everyone else. But the scenes themselves, full of real life and movement, were something people had never seen in a painting before.',
        isEvidence: true,
      },
    ],
    audioScript: {
      intro: 'Question 7. You hear a woman on the radio talking about a painter. What made the painter’s work unusual?',
      extractText:
        'Woman: Most painters of that time worked indoors, in studios, because carrying paint around was so difficult. What makes Henri Duval’s work stand out is that he refused to do that. Believe it or not, he painted on the tops of mountains, on fishing boats, even in the middle of busy markets. His colours weren’t particularly bright – in fact, they were quite dark and heavy, like those of most painters of his generation – and he used exactly the same oil paints as everyone else. But the scenes themselves, full of real life and movement, were something people had never seen in a painting before.',
    },
  },
  {
    id: 8,
    part: 1,
    type: 'multiple-choice-3',
    scenario: 'You hear two friends talking about a fancy-dress party.',
    question: 'What does the boy think about the costume the girl is planning?',
    options: [
      { key: 'A', text: 'It will be too hot to wear.' },
      { key: 'B', text: 'It will take too long to make.' },
      { key: 'C', text: 'It won’t be original enough.' },
    ],
    correctAnswer: 'B',
    skillTested: 'Inferring opinions and practical doubts',
    evidenceQuote:
      'Boy: "The party’s on Saturday, isn’t it? That’s only three days away. The helmet alone could take you a whole evening, and then there’s the shield … I just don’t see how you’ll get it all done in time."',
    explanation: {
      correct:
        'The boy doubts that she will manage to finish making the costume in time, as the party is only three days away.',
      distractors: [
        { key: 'A', reason: 'He briefly asks if she will be boiling, but she clarifies it is lightweight cardboard and paint, and he accepts this.' },
        { key: 'C', reason: 'He agrees that it will be completely original: "That’s true, it’ll be different."' },
      ],
      examTip: 'Pay attention to which concern remains unresolved. The heat question is dismissed; the time constraint is his true objection.',
    },
    dialogue: [
      { speaker: 'Girl', text: 'I’ve decided what I’m going as to Jack’s party – a knight! Helmet, sword and shield, the lot.' },
      { speaker: 'Boy', text: 'Cool. Won’t you be boiling in all that, though?' },
      { speaker: 'Girl', text: 'No, it’s all cardboard and paint. It’ll be really light.' },
      { speaker: 'Boy', text: 'Oh, you’re making it yourself? The party’s on Saturday, isn’t it? That’s only three days away. The helmet alone could take you a whole evening, and then there’s the shield … I just don’t see how you’ll get it all done in time.', isEvidence: true },
      { speaker: 'Girl', text: 'I’ll manage. And at least no one else will have the same costume.' },
      { speaker: 'Boy', text: 'That’s true, it’ll be different. I’d just buy a mask, though, if I were you.' },
    ],
    audioScript: {
      intro: 'Question 8. You hear two friends talking about a fancy-dress party. What does the boy think about the costume the girl is planning?',
      extractText:
        'Girl: I’ve decided what I’m going as to Jack’s party – a knight! Helmet, sword and shield, the lot.\nBoy: Cool. Won’t you be boiling in all that, though?\nGirl: No, it’s all cardboard and paint. It’ll be really light.\nBoy: Oh, you’re making it yourself? The party’s on Saturday, isn’t it? That’s only three days away. The helmet alone could take you a whole evening, and then there’s the shield … I just don’t see how you’ll get it all done in time.\nGirl: I’ll manage. And at least no one else will have the same costume.\nBoy: That’s true, it’ll be different. I’d just buy a mask, though, if I were you.',
    },
  },

  // ==========================================
  // PART 2: Questions 9 - 18 (Sentence Completion)
  // ==========================================
  {
    id: 9,
    part: 2,
    type: 'sentence-completion',
    question: 'The survival course took place in a forest next to a (9) ........................................ .',
    sentencePrefix: 'The survival course took place in a forest next to a',
    sentenceSuffix: '.',
    correctAnswer: 'lake',
    acceptedAnswers: ['lake', 'a lake'],
    skillTested: 'Identifying location details in monologue',
    evidenceQuote: 'Ryan: "...not in the mountains or by the coast, but in an ancient forest right beside a huge lake, which was our only source of water."',
    explanation: {
      correct: 'The speaker states that the camp was located in a forest next to a lake.',
      examTip: 'Check grammatical fit: "next to a [lake]". Only write 1-3 words.',
    },
  },
  {
    id: 10,
    part: 2,
    type: 'sentence-completion',
    question: 'Ryan and the others were surprised that they were not given (10) ........................................ when they arrived.',
    sentencePrefix: 'Ryan and the others were surprised that they were not given',
    sentenceSuffix: 'when they arrived.',
    correctAnswer: 'tents',
    acceptedAnswers: ['tents', 'tent'],
    skillTested: 'Recognizing unexpected conditions and missing equipment',
    evidenceQuote: 'Ryan: "When we arrived, we assumed we’d be handed tents to sleep in, so we were stunned when they told us we’d have to build our own shelter."',
    explanation: {
      correct: 'Ryan and his fellow participants were surprised that they were not provided with tents upon arrival.',
      examTip: 'The sentence structure "were not given [tents]" matches the audio.',
    },
  },
  {
    id: 11,
    part: 2,
    type: 'sentence-completion',
    question: 'It took Ryan’s group nearly (11) ........................................ to build their shelter.',
    sentencePrefix: 'It took Ryan’s group nearly',
    sentenceSuffix: 'to build their shelter.',
    correctAnswer: 'four hours',
    acceptedAnswers: ['four hours', '4 hours', 'four', '4'],
    skillTested: 'Distinguishing time intervals and avoiding time distractors',
    evidenceQuote: 'Ryan: "The instructor said an experienced team could do it in an hour, but for our group it took nearly four hours before it was finally sturdy."',
    explanation: {
      correct: 'It took nearly four hours (or 4 hours) for Ryan’s group to finish building their shelter. "An hour" is a distractor describing experts.',
      examTip: 'Beware of distractor times: the instructor mentioned one hour for experts, but Ryan\'s group took four hours.',
    },
  },
  {
    id: 12,
    part: 2,
    type: 'sentence-completion',
    question: 'Before becoming an instructor, Kate was a (12) ........................................ volunteer.',
    sentencePrefix: 'Before becoming an instructor, Kate was a',
    sentenceSuffix: 'volunteer.',
    correctAnswer: 'mountain rescue',
    acceptedAnswers: ['mountain rescue', 'mountain-rescue'],
    skillTested: 'Identifying past professional and volunteer experience',
    evidenceQuote: 'Ryan: "Our instructor Kate was incredible. Before taking up teaching survival skills, she’d spent several years as a mountain rescue volunteer."',
    explanation: {
      correct: 'Before becoming an instructor, Kate served as a mountain rescue volunteer.',
      examTip: 'Copy the exact two words: "mountain rescue".',
    },
  },
  {
    id: 13,
    part: 2,
    type: 'sentence-completion',
    question: 'Kate said that the most important survival skill of all is (13) ........................................ .',
    sentencePrefix: 'Kate said that the most important survival skill of all is',
    sentenceSuffix: '.',
    correctAnswer: 'staying calm',
    acceptedAnswers: ['staying calm', 'keeping calm', 'calmness', 'stay calm', 'keep calm'],
    skillTested: 'Identifying superlative advice and key survival philosophy',
    evidenceQuote: 'Ryan: "Kate told us that while building fires is useful, the single most critical survival skill above all else is staying calm."',
    explanation: {
      correct: 'Kate emphasized that staying calm (or keeping calm) is the most vital survival skill when facing an emergency.',
      examTip: 'The prompt uses "the most important survival skill of all", which signals a superlative in the speech.',
    },
  },
  {
    id: 14,
    part: 2,
    type: 'sentence-completion',
    question: 'To light a fire, Ryan had to use a piece of flint and a (14) ........................................ .',
    sentencePrefix: 'To light a fire, Ryan had to use a piece of flint and a',
    sentenceSuffix: '.',
    correctAnswer: 'steel bar',
    acceptedAnswers: ['steel bar', 'steel', 'bar of steel'],
    skillTested: 'Identifying specific equipment while ruling out distractors',
    evidenceQuote: 'Ryan: "We weren’t allowed matches or lighters. I tried scraping my knife against the rock, but Kate showed us how to strike the flint against a steel bar."',
    explanation: {
      correct: 'To light a fire, Ryan used a piece of flint and a steel bar. Matches and knife were mentioned as distractors.',
      examTip: 'Listen for what tool was actually used, not the prohibited matches or knife.',
    },
  },
  {
    id: 15,
    part: 2,
    type: 'sentence-completion',
    question: 'The students collected rainwater using a plastic sheet called a (15) ........................................ .',
    sentencePrefix: 'The students collected rainwater using a plastic sheet called a',
    sentenceSuffix: '.',
    correctAnswer: 'tarpaulin',
    acceptedAnswers: ['tarpaulin', 'tarpolin', 'tarp'],
    skillTested: 'Identifying specialized technical equipment noun',
    evidenceQuote: 'Ryan: "To gather rainwater safely, we rigged up a durable waterproof plastic sheet known as a tarpaulin."',
    explanation: {
      correct: 'The heavy plastic sheet used to catch rainwater is called a tarpaulin (or tarp / tarpolin).',
      examTip: 'Minor spelling variations (like "tarpolin") are accepted if phonetically recognisable.',
    },
  },
  {
    id: 16,
    part: 2,
    type: 'sentence-completion',
    question: 'Ryan says that the crickets they ate tasted like (16) ........................................ .',
    sentencePrefix: 'Ryan says that the crickets they ate tasted like',
    sentenceSuffix: '.',
    correctAnswer: 'popcorn',
    acceptedAnswers: ['popcorn', 'pop corn'],
    skillTested: 'Identifying sensory descriptions and food comparisons',
    evidenceQuote: 'Ryan: "We couldn’t catch any fish or find edible berries, so we roasted crickets. Believe it or not, once toasted they actually tasted just like popcorn!"',
    explanation: {
      correct: 'Ryan compares the flavor of roasted crickets to popcorn. Berries and fish are distractors that they could not find.',
      examTip: 'Listen for the comparative phrase "tasted like [popcorn]".',
    },
  },
  {
    id: 17,
    part: 2,
    type: 'sentence-completion',
    question: 'During the solo night, each student had a (17) ........................................ in case of emergencies.',
    sentencePrefix: 'During the solo night, each student had a',
    sentenceSuffix: 'in case of emergencies.',
    correctAnswer: 'whistle',
    acceptedAnswers: ['whistle', 'a whistle'],
    skillTested: 'Identifying emergency safety equipment',
    evidenceQuote: 'Ryan: "For our solo night alone in the dark forest, phones were confiscated, but we were each given a whistle around our neck in case of emergency."',
    explanation: {
      correct: 'Each student was equipped with a whistle to signal for help during the solo night.',
      examTip: 'The phrase "in case of emergencies" directly mirrors "in case of emergency" in the talk.',
    },
  },
  {
    id: 18,
    part: 2,
    type: 'sentence-completion',
    question: 'Ryan says that the course gave him more (18) ........................................ than anything else.',
    sentencePrefix: 'Ryan says that the course gave him more',
    sentenceSuffix: 'than anything else.',
    correctAnswer: 'confidence',
    acceptedAnswers: ['confidence', 'self confidence', 'self-confidence'],
    skillTested: 'Recognizing personal outcomes and emotional growth',
    evidenceQuote: 'Ryan: "While I learned practical wilderness techniques, what the experience really gave me more than anything else was confidence."',
    explanation: {
      correct: 'The ultimate benefit Ryan gained from the survival course was confidence.',
      examTip: 'Notice the cue: "more than anything else was [confidence]".',
    },
  },

  // ==========================================
  // PART 3: Questions 19 - 23 (Multiple Matching)
  // ==========================================
  {
    id: 19,
    part: 3,
    type: 'multiple-matching',
    speakerNumber: 1,
    question: 'Speaker 1: Choose what the speaker says about getting used to something new.',
    correctAnswer: 'E',
    skillTested: 'Matching speaker sentiment regarding social support and individuals',
    evidenceQuote: 'Speaker 1: "Moving to a new school in the middle of term was every bit as bad as I’d imagined at first. But then I met Hana, who sat next to me in chemistry. She showed me around, introduced me to her crowd, and honestly, she changed everything."',
    explanation: {
      correct: 'Option E ("Someone I met made a big difference") matches Speaker 1, who explains that meeting Hana completely changed her experience for the better. Option G is ruled out because it was "every bit as bad as I’d imagined".',
      examTip: 'Listen for descriptions of people who helped ("meeting Hana... changed everything" = Someone I met made a big difference).',
    },
  },
  {
    id: 20,
    part: 3,
    type: 'multiple-matching',
    speakerNumber: 2,
    question: 'Speaker 2: Choose what the speaker says about getting used to something new.',
    correctAnswer: 'H',
    skillTested: 'Recognizing time management and scheduling adjustments',
    evidenceQuote: 'Speaker 2: "When I took on a weekend job alongside GCSE study, I kept running out of time for assignments. So I started planning my week every Sunday evening, blocking out study sessions. I’m so much better at managing my days now."',
    explanation: {
      correct: 'Option H ("It changed the way I organise my time") matches Speaker 2, who began planning their week on Sunday evenings and became much better at managing their schedule.',
      examTip: '"Planning my week... better at managing my days" paraphrases "changed the way I organise my time".',
    },
  },
  {
    id: 21,
    part: 3,
    type: 'multiple-matching',
    speakerNumber: 3,
    question: 'Speaker 3: Choose what the speaker says about getting used to something new.',
    correctAnswer: 'C',
    skillTested: 'Identifying an ongoing unresolved challenge',
    evidenceQuote: 'Speaker 3: "When my family relocated to northern Scotland, the chilly weather didn’t bother me, and I quickly adjusted to the quiet village. But what I still haven’t got used to is how dark it is in winter – night starts at 3:30 p.m. and I still struggle with it."',
    explanation: {
      correct: 'Option C ("I still find one part of it difficult") matches Speaker 3, who adapted to the weather and quietness, but continues to struggle with the darkness in winter.',
      examTip: 'Listen for phrases like "what I still haven’t got used to is..." signaling an ongoing issue.',
    },
  },
  {
    id: 22,
    part: 3,
    type: 'multiple-matching',
    speakerNumber: 4,
    question: 'Speaker 4: Choose what the speaker says about getting used to something new.',
    correctAnswer: 'A',
    skillTested: 'Recognizing family contrast in adaptation',
    evidenceQuote: 'Speaker 4: "When we gave up our car and switched to cycling and buses, my sister and I adjusted without any fuss. The person who really struggled was my mum, who had driven everywhere for twenty years and found public transport stressful."',
    explanation: {
      correct: 'Option A ("It was harder for someone else in my family than for me") matches Speaker 4, who emphasizes that their mother struggled far more with the transition than they did.',
      examTip: 'Identify comparative family references: "The person who really struggled was my mum".',
    },
  },
  {
    id: 23,
    part: 3,
    type: 'multiple-matching',
    speakerNumber: 5,
    question: 'Speaker 5: Choose what the speaker says about getting used to something new.',
    correctAnswer: 'F',
    skillTested: 'Identifying new hobbies or passions born from change',
    evidenceQuote: 'Speaker 5: "After spraining my ankle, I was stuck at home for two months and couldn’t play sports. My uncle lent me his digital camera, and through observing birds in the garden, I’ve become completely fascinated by wildlife photography."',
    explanation: {
      correct: 'Option F ("It helped me to discover a new interest") matches Speaker 5, who developed a passion for wildlife photography while recovering from an injury.',
      examTip: '"Become completely fascinated by..." denotes discovering a new interest or hobby.',
    },
  },

  // ==========================================
  // PART 4: Questions 24 - 30 (Interview: Mia Lawson)
  // ==========================================
  {
    id: 24,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'How did Mia first become interested in costume design?',
    options: [
      { key: 'A', text: 'Her grandmother taught her how to sew.' },
      { key: 'B', text: 'She helped with a show at her school.' },
      { key: 'C', text: 'She was inspired by costumes she saw in films.' },
    ],
    correctAnswer: 'B',
    skillTested: 'Identifying origin and initial inspiration',
    evidenceQuote: 'Mia: "It all started when I was fourteen and my school put on a musical. The art teacher asked for volunteers to help with the wardrobe, and the moment I saw how fabrics could transform an actor, I was hooked."',
    explanation: {
      correct: 'Mia first got interested when she volunteered to help with a musical show staged at her school.',
      distractors: [
        { key: 'A', reason: 'Her grandmother taught her basic knitting, but did not inspire theatrical costume design.' },
        { key: 'C', reason: 'She watched movies, but her active passion was ignited by the school musical production.' },
      ],
      examTip: 'The phrase "It all started when..." signals the true origin of her interest.',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'Mia, you’ve become a successful young costume designer. How did you first get into it?' },
      { speaker: 'Mia', text: 'It all started when I was fourteen and my school put on a musical. The art teacher asked for volunteers to help with wardrobe. My grandmother had shown me how to sew buttons on, but working on that school production and seeing how costumes brought characters to life completely captivated me.', isEvidence: true },
    ],
  },
  {
    id: 25,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'What does Mia say about the first costume she made?',
    options: [
      { key: 'A', text: 'She was disappointed with the result.' },
      { key: 'B', text: 'It was more complicated than she had expected.' },
      { key: 'C', text: 'It took longer to make than she had planned.' },
    ],
    correctAnswer: 'A',
    skillTested: 'Evaluating speaker reaction to early work',
    evidenceQuote: 'Mia: "I was quite disappointed, to be honest. It turned out exactly as complex as I thought, and I finished it ahead of schedule, but the cape draped awkwardly and looked cheap on stage."',
    explanation: {
      correct: 'Mia admits she was disappointed with the result of her first costume because the finished piece looked awkward on stage.',
      distractors: [
        { key: 'B', reason: 'She notes it was "as complicated as expected", not more complicated.' },
        { key: 'C', reason: 'She finished it ahead of time rather than taking longer than planned.' },
      ],
      examTip: 'Notice the contrast: she finished early and anticipated the complexity, but felt let down by the final appearance.',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'Do you remember the very first costume you created all on your own?' },
      { speaker: 'Mia', text: 'I do. It was a medieval cape for a local play. I was quite disappointed, to be honest. I’d researched the sewing techniques, so it wasn’t more complex than I expected, and I actually finished days early. But when the actor stepped onto the stage, the fabric fell awkwardly and looked dreadful under the lights!', isEvidence: true },
    ],
  },
  {
    id: 26,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'According to Mia, what is the most important quality for a costume designer?',
    options: [
      { key: 'A', text: 'being imaginative' },
      { key: 'B', text: 'being patient' },
      { key: 'C', text: 'being organised' },
    ],
    correctAnswer: 'C',
    skillTested: 'Identifying priority personal qualities',
    evidenceQuote: 'Mia: "People assume creativity or patience is the top requirement, but what really matters is being organised. You have fifty outfits, dozens of fittings, tight delivery schedules, and if you lose track, the entire production collapses."',
    explanation: {
      correct: 'According to Mia, the single most critical quality is being organised, as managing outfits, fittings, and strict deadlines is paramount.',
      distractors: [
        { key: 'A', reason: 'Imagination is valuable, but secondary to keeping everything on schedule.' },
        { key: 'B', reason: 'Patience helps with difficult fittings, but organisation is what "really matters".' },
      ],
      examTip: 'Look out for Unit 4 personality adjectives and the phrase "what really matters is...".',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'What quality would you say matters most in your profession?' },
      { speaker: 'Mia', text: 'A lot of people think you just need to be super imaginative, and of course being patient helps when sewing seams for hours. But what really matters is being organised. When you’re coordinating fifty costumes across ten scenes with fast changes, keeping track of every collar and button is what makes or breaks the show.', isEvidence: true },
    ],
  },
  {
    id: 27,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'Why does Mia like using old clothes in her designs?',
    options: [
      { key: 'A', text: 'It is cheaper than buying new material.' },
      { key: 'B', text: 'It gives her ideas she might not otherwise have.' },
      { key: 'C', text: 'It is better for the environment.' },
    ],
    correctAnswer: 'B',
    skillTested: 'Comprehending creative stimuli and unconventional methods',
    evidenceQuote: 'Mia: "Of course recycling helps save budget and cuts waste, but the real thrill is that vintage garments make me think in a completely different way. I end up with designs I’d never have come up with on a blank sketchpad."',
    explanation: {
      correct: 'Working with old clothes stimulates fresh creative inspiration ("gives her ideas she might not otherwise have").',
      distractors: [
        { key: 'A', reason: 'Saving money is a side effect, but not her primary motivation.' },
        { key: 'C', reason: 'Environmental benefits are acknowledged, but the artistic inspiration is why she prefers it.' },
      ],
      examTip: 'Note the phrase: "I end up with designs I’d never have come up with".',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'You’re famous for upcycling second-hand clothing. Why is that your preferred approach?' },
      { speaker: 'Mia', text: 'Sure, it’s economical, and reusing fabrics is good for the environment. But for me, deconstructing an old leather jacket or a retro bathrobe makes me think in a completely different way. I end up with designs I’d never have come up with starting from scratch.', isEvidence: true },
    ],
  },
  {
    id: 28,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'What does Mia say about working with actors?',
    options: [
      { key: 'A', text: 'They often have strong opinions about what their character wears.' },
      { key: 'B', text: 'They sometimes complain that the costumes are uncomfortable.' },
      { key: 'C', text: 'They rarely appreciate how much work is involved.' },
    ],
    correctAnswer: 'A',
    skillTested: 'Identifying professional interpersonal dynamics',
    evidenceQuote: 'Mia: "Actors don’t just put on whatever you hand them; they do tend to have very clear ideas about what their character should wear, so you have to negotiate and find a middle ground."',
    explanation: {
      correct: 'Mia points out that actors usually possess very definite views about what their characters should wear.',
      distractors: [
        { key: 'B', reason: 'She designs for comfort so they rarely complain about physical discomfort.' },
        { key: 'C', reason: 'She finds actors very grateful and appreciative of the wardrobe team’s dedication.' },
      ],
      examTip: '"Have very clear ideas about what their character should wear" directly matches "often have strong opinions".',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'What is it like collaborating with the actors themselves?' },
      { speaker: 'Mia', text: 'It’s fascinating. Performers know their roles deeply, and they do tend to have very clear ideas about what their character should wear. You have to listen carefully to their vision while staying faithful to the director’s brief.', isEvidence: true },
    ],
  },
  {
    id: 29,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'What does Mia find most frustrating about her job?',
    options: [
      { key: 'A', text: 'having too little money to spend' },
      { key: 'B', text: 'having to work very long hours' },
      { key: 'C', text: 'having plans changed at the last minute' },
    ],
    correctAnswer: 'C',
    skillTested: 'Identifying personal grievances and work frustrations',
    evidenceQuote: 'Mia: "I don’t mind working late or working with small budgets. What really gets to me is when a director changes their mind a few days before the opening night, meaning days of work have to be scrapped."',
    explanation: {
      correct: 'What Mia finds most frustrating is when directors alter decisions right before opening night ("having plans changed at the last minute").',
      distractors: [
        { key: 'A', reason: 'She accepts tight budgets as part of the creative challenge.' },
        { key: 'B', reason: 'She doesn\'t mind putting in long hours because she loves the theatrical atmosphere.' },
      ],
      examTip: 'The idiomatic phrase "What really gets to me is..." introduces what she finds most frustrating.',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'Every job has its drawbacks. What is the most frustrating part of costume design?' },
      { speaker: 'Mia', text: 'I don’t mind late nights before dress rehearsals, and limited budgets can spark ingenuity. What really gets to me is when a director changes their mind a few days before the opening night. Scrapping finished garments and starting over in forty-eight hours is utterly stressful.', isEvidence: true },
    ],
  },
  {
    id: 30,
    part: 4,
    type: 'multiple-choice-3',
    scenario: 'You will hear an interview with a young costume designer called Mia Lawson.',
    question: 'What advice does Mia give to young people who want to do her job?',
    options: [
      { key: 'A', text: 'Study fashion at university.' },
      { key: 'B', text: 'Don’t be afraid of getting things wrong.' },
      { key: 'C', text: 'Try to meet people who work in theatre.' },
    ],
    correctAnswer: 'B',
    skillTested: 'Understanding closing advice and core encouragement',
    evidenceQuote: 'Mia: "My biggest piece of advice is not to be afraid of getting them wrong. Every mistake I’ve made has taught me something, so experiment and embrace errors."',
    explanation: {
      correct: 'Mia urges aspiring designers not to fear making mistakes, because every error teaches valuable lessons.',
      distractors: [
        { key: 'A', reason: 'She says a university degree isn\'t compulsory; practical experience is more helpful.' },
        { key: 'C', reason: 'Networking is mentioned, but her primary piece of advice centers on fearlessness regarding mistakes.' },
      ],
      examTip: '"Not to be afraid of getting them wrong" directly matches Option B.',
    },
    dialogue: [
      { speaker: 'Interviewer', text: 'Finally Mia, what advice would you offer teenagers wanting to break into costume design?' },
      { speaker: 'Mia', text: 'You don’t have to get a university fashion degree right away. The crucial thing is not to be afraid of getting things wrong. Every mistake I’ve made has taught me something. Just start creating, learn from what fails, and keep experimenting.', isEvidence: true },
    ],
  },
];

export const FULL_EXAM_PARTS: {
  part: PartNumber;
  title: string;
  questionRange: string;
  description: string;
}[] = [
  { part: 1, title: 'Part 1: Eight Situations', questionRange: 'Questions 1 – 8', description: 'Multiple-choice listening across 8 distinct short monologues and dialogues.' },
  { part: 2, title: 'Part 2: Sentence Completion', questionRange: 'Questions 9 – 18', description: 'Ryan’s talk on a wilderness survival skills course (Gap-fill sentence completion).' },
  { part: 3, title: 'Part 3: Multiple Matching', questionRange: 'Questions 19 – 23', description: 'Five teenagers describe getting used to something new (Match Speaker 1–5 to A–H).' },
  { part: 4, title: 'Part 4: Interview', questionRange: 'Questions 24 – 30', description: 'Interview with young theatrical costume designer Mia Lawson (7 multiple-choice questions).' },
];

export const PART_2_AUDIO = {
  part: 2 as PartNumber,
  title: 'Part 2: Sentence Completion',
  description: 'Ryan talks about his wilderness survival skills course.',
  dialogue: [
    { speaker: 'Ryan', text: 'Hi everyone, my name is Ryan, and I am here to tell you about the wilderness survival skills course I took last summer. It was an incredible experience that really pushed me out of my comfort zone.' },
    { speaker: 'Ryan', text: 'The course was held in an ancient forest right beside a huge lake, which was our only source of water throughout the week.' },
    { speaker: 'Ryan', text: 'When we arrived, we assumed we’d be handed tents to sleep in, so we were stunned when they told us we’d have to build our own shelter.' },
    { speaker: 'Ryan', text: 'The instructor said an experienced team could do it in an hour, but for our group it took nearly four hours before it was finally sturdy.' },
    { speaker: 'Ryan', text: 'Our instructor, Kate, was fantastic. Before becoming an instructor, she had spent five years as a mountain rescue volunteer, so we always felt safe.' },
    { speaker: 'Ryan', text: 'On the second day, we learned foraging. The most exciting discovery was finding wild garlic growing abundantly along the damp stream banks.' },
    { speaker: 'Ryan', text: 'For navigation, Kate explained that while moss on trees can deceive you, using the stars on clear nights was by far the most reliable method.' },
    { speaker: 'Ryan', text: 'Lighting a fire without matches was tough, but once we collected dry pine needles for tinder, the sparks caught immediately.' },
    { speaker: 'Ryan', text: 'At night it grew surprisingly chilly, and the only item that kept my hands and ears warm was my thermal fleece.' },
    { speaker: 'Ryan', text: 'The final group project was engineering a basic rope bridge over a rocky ravine. It took teamwork and patience to test its load.' },
    { speaker: 'Ryan', text: 'Looking back, what I gained most was a newfound confidence. If you ever have the chance to attend, I wholeheartedly recommend it.' },
  ],
};

export const PART_3_AUDIO = {
  part: 3 as PartNumber,
  title: 'Part 3: Multiple Matching',
  description: 'Five speakers talk about getting used to something new.',
  dialogue: [
    { speaker: 'Reader', text: 'Speaker 1.' },
    { speaker: 'Speaker 1', text: 'When our family relocated across the country last autumn, I was terrified that I’d struggle to adapt and miss my old neighbourhood. But honestly, within three weeks of starting my new secondary school, I felt settled. I was amazed by how effortlessly I made close friends and learned the local bus routes.' },
    { speaker: 'Reader', text: 'Speaker 2.' },
    { speaker: 'Speaker 2', text: 'Switching to home-schooling was a drastic decision for me. I initially thought having complete freedom over my study timetable would be a breeze. But even now, after six months, sticking to self-imposed deadlines remains an uphill struggle. Finding the discipline to finish essays without teachers prompting me is still tough.' },
    { speaker: 'Reader', text: 'Speaker 3.' },
    { speaker: 'Speaker 3', text: 'Joining the regional youth rowing club was daunting because everyone else seemed to have rowed for years. I almost quit on my second weekend until Marcus, the senior coxswain, took me under his wing and patiently taught me blade coordination. Without his constant encouragement, I never would have stuck with it.' },
    { speaker: 'Reader', text: 'Speaker 4.' },
    { speaker: 'Speaker 4', text: 'When our parents decided to give up the family car to reduce our carbon footprint, my brother and I adapted without any fuss by hopping on our bicycles. But my mother, who had driven to work every single morning for twenty-five years, found travelling by bus exhausting and stressful. It was far more difficult for her than for us.' },
    { speaker: 'Reader', text: 'Speaker 5.' },
    { speaker: 'Speaker 5', text: 'After severely twisting my ankle, I was couch-bound for nearly ten weeks and couldn’t play basketball. To keep my spirits up, my grandfather gave me his old camera. Spending hours photographing birds in the back garden sparked an obsession with wildlife photography that has completely changed my weekends.' },
  ],
};

export const PART_4_AUDIO = {
  part: 4 as PartNumber,
  title: 'Part 4: Interview with Mia Lawson',
  description: 'Interview with young theatrical costume designer Mia Lawson.',
  dialogue: [
    { speaker: 'Interviewer', text: 'Welcome to Theatre Today. Our guest is Mia Lawson, a successful young costume designer. Mia, how did you first get into costume design?' },
    { speaker: 'Mia', text: 'It all started when I was fourteen and my school put on a musical. The art teacher asked for volunteers to help with the wardrobe. The moment I saw how fabrics could transform an actor, I was hooked.' },
    { speaker: 'Interviewer', text: 'You chose to study history at university rather than fashion. Why?' },
    { speaker: 'Mia', text: 'Costume design is about social context. Why did Victorians wear stiff collars? Studying history gave me an analytical framework to research time periods with authentic precision.' },
    { speaker: 'Interviewer', text: 'Where do you find your primary inspiration for costume designs?' },
    { speaker: 'Mia', text: 'For me, inspiration strikes when browsing charity shops and vintage markets. Finding a worn velvet coat with authentic fraying triggers an entire character concept.' },
    { speaker: 'Interviewer', text: 'You are well known for using recycled materials. What draws you to old clothes?' },
    { speaker: 'Mia', text: 'Old garments possess a lived-in texture, natural fading, and drape that brand-new synthetic fabrics simply cannot replicate. Plus sustainability in theatre is vital.' },
    { speaker: 'Interviewer', text: 'What is the most frustrating part of your job?' },
    { speaker: 'Mia', text: 'What really gets to me is when a director changes their mind a few days before opening night, and you have to discard a week of work and start over.' },
    { speaker: 'Interviewer', text: 'Finally Mia, what advice would you offer aspiring costume designers?' },
    { speaker: 'Mia', text: 'The crucial thing is not to be afraid of getting things wrong. Every mistake I’ve made has taught me something. Learn from errors and keep experimenting.' },
  ],
};

export const VOCABULARY_LIST: VocabularyItem[] = [
  // Part 1
  {
    id: 'v1',
    term: 'kept me guessing',
    phonetic: '/kɛpt miː ˈɡɛs.ɪŋ/',
    type: 'idiom',
    definition: 'made it impossible to predict what would happen next; sustained suspense',
    inContext: 'But the plot kept me guessing, didn’t it?',
    part: 1,
    questionId: 1,
    example: 'The mystery film kept the audience guessing until the very last frame.',
    cefrLevel: 'B2',
  },
  {
    id: 'v2',
    term: 'sorted out far too neatly',
    phonetic: '/ˈsɔːtɪd aʊt fɑː tuː ˈniːtli/',
    type: 'collocation',
    definition: 'resolved in an unrealistically convenient or simplistic manner without realistic messiness',
    inContext: 'Everything was sorted out far too neatly.',
    part: 1,
    questionId: 1,
    example: 'Good novels avoid storylines where every dilemma is sorted out far too neatly.',
    cefrLevel: 'B2',
  },
  {
    id: 'v3',
    term: 'stuck to it',
    phonetic: '/stʌk tuː ɪt/',
    type: 'phrasal verb',
    definition: 'persisted with, adhered faithfully to a plan or schedule without deviating',
    inContext: '...so I did, and I actually stuck to it quite well...',
    part: 1,
    questionId: 2,
    example: 'Even during challenging weeks she made a study routine and stuck to it.',
    cefrLevel: 'B2',
  },
  {
    id: 'v4',
    term: 'queues of motorists',
    phonetic: '/kjuːz əv ˈməʊtərɪsts/',
    type: 'noun phrase',
    definition: 'long lines of stationary or slow-moving cars stuck in gridlock traffic',
    inContext: 'No more sitting in queues of motorists, wondering whether I’ll make my nine o’clock meeting.',
    part: 1,
    questionId: 3,
    example: 'Morning radio updates warned commuters of endless queues of motorists on the M25.',
    cefrLevel: 'B2',
  },
  {
    id: 'v5',
    term: 'stand out',
    phonetic: '/stænd aʊt/',
    type: 'phrasal verb',
    definition: 'to be prominently noticeable or clearly superior to others of the same kind',
    inContext: 'What makes Henri Duval’s work stand out is that he refused to do that.',
    part: 1,
    questionId: 7,
    example: 'Her natural public speaking charisma made her stand out among all applicants.',
    cefrLevel: 'B2',
  },
  {
    id: 'v6',
    term: 'the lot',
    phonetic: '/ðə lɒt/',
    type: 'idiom (informal)',
    definition: 'everything, the whole collection or complete assortment of items',
    inContext: '...a knight! Helmet, sword and shield, the lot.',
    part: 1,
    questionId: 8,
    example: 'He ordered burger, fries, onion rings, milkshake – the lot!',
    cefrLevel: 'B2',
  },

  // Part 2
  {
    id: 'v7',
    term: 'tarpaulin',
    phonetic: '/tɑːˈpɔː.lɪn/',
    type: 'noun',
    definition: 'a heavy, durable waterproof cloth or plastic sheet used for shelter and rain protection',
    inContext: 'The students collected rainwater using a plastic sheet called a tarpaulin.',
    part: 2,
    questionId: 15,
    example: 'Campers secured a blue tarpaulin over their backpacks to keep dry.',
    cefrLevel: 'B2',
  },
  {
    id: 'v8',
    term: 'staying calm',
    phonetic: '/ˈsteɪ.ɪŋ kɑːm/',
    type: 'collocation',
    definition: 'maintaining composure and self-control without panicking under emergency stress',
    inContext: 'Kate said that the most important survival skill of all is staying calm.',
    part: 2,
    questionId: 13,
    example: 'Staying calm during an emergency allows you to make rational safety decisions.',
    cefrLevel: 'B1',
  },
  {
    id: 'v9',
    term: 'flint and steel bar',
    phonetic: '/flɪnt ənd stiːl bɑː/',
    type: 'noun phrase',
    definition: 'primitive traditional fire-making equipment that creates hot sparks when struck together',
    inContext: 'To light a fire, Ryan had to use a piece of flint and a steel bar.',
    part: 2,
    questionId: 14,
    example: 'He practiced sparking tinder with a piece of flint and steel bar.',
    cefrLevel: 'B2',
  },
  {
    id: 'v10',
    term: 'mountain rescue',
    phonetic: '/ˈmaʊn.tɪn ˈres.kjuː/',
    type: 'noun phrase',
    definition: 'an emergency search-and-rescue service operating in steep, wilderness terrain',
    inContext: 'Before becoming an instructor, Kate was a mountain rescue volunteer.',
    part: 2,
    questionId: 12,
    example: 'Volunteers for mountain rescue often deploy in freezing blizzards.',
    cefrLevel: 'B2',
  },

  // Part 3
  {
    id: 'v11',
    term: 'get used to',
    phonetic: '/ɡɛt juːzd tuː/',
    type: 'phrasal verb',
    definition: 'to adapt or become accustomed to a novel, unfamiliar situation over time',
    inContext: 'What I still haven’t got used to is how dark it is in winter.',
    part: 3,
    questionId: 21,
    example: 'It took her three months to get used to waking up at 6:00 a.m. for school.',
    cefrLevel: 'B1',
  },
  {
    id: 'v12',
    term: 'manage one’s time',
    phonetic: '/ˈmæn.ɪdʒ wʌnz taɪm/',
    type: 'collocation',
    definition: 'to allocate, plan, and schedule hours effectively to avoid missing deadlines',
    inContext: 'I started planning my week every Sunday evening... better at managing my days.',
    part: 3,
    questionId: 20,
    example: 'Students who manage their time efficiently experience far less exam anxiety.',
    cefrLevel: 'B2',
  },
  {
    id: 'v13',
    term: 'fascinated by',
    phonetic: '/ˈfæs.ɪ.neɪ.tɪd baɪ/',
    type: 'adjective + preposition',
    definition: 'intensely interested, captivated, and absorbed by a subject or phenomenon',
    inContext: 'I’ve become completely fascinated by wildlife photography.',
    part: 3,
    questionId: 23,
    example: 'He was fascinated by marine biology after visiting the coastal sanctuary.',
    cefrLevel: 'B2',
  },

  // Part 4
  {
    id: 'v14',
    term: 'upcycling / old clothes',
    phonetic: '/ˈʌpˌsaɪ.klɪŋ/',
    type: 'noun / participle',
    definition: 'reusing discarded or second-hand garments to create higher-value artistic designs',
    inContext: 'Why does Mia like using old clothes in her designs?',
    part: 4,
    questionId: 27,
    example: 'Upcycling vintage denim has become a major trend in sustainable theatre production.',
    cefrLevel: 'B2',
  },
  {
    id: 'v15',
    term: 'what really gets to me',
    phonetic: '/wɒt ˈrɪə.li ɡɛts tuː miː/',
    type: 'idiom',
    definition: 'what genuinely annoys, frustrates, or upsets me above all else',
    inContext: 'What really gets to me is when a director changes their mind a few days before opening night.',
    part: 4,
    questionId: 29,
    example: 'What really gets to me is people who arrive twenty minutes late without apologizing.',
    cefrLevel: 'B2',
  },
  {
    id: 'v16',
    term: 'not to be afraid of getting things wrong',
    phonetic: '/nɒt tuː biː əˈfreɪd əv ˈɡɛt.ɪŋ θɪŋz rɒŋ/',
    type: 'proverbial advice',
    definition: 'embracing mistakes as necessary learning steps rather than fearing errors',
    inContext: 'not to be afraid of getting them wrong. Every mistake I’ve made has taught me something.',
    part: 4,
    questionId: 30,
    example: 'Great innovators advise aspiring artists not to be afraid of getting things wrong.',
    cefrLevel: 'B2',
  },
];

export const CAMBRIDGE_SCALE_30 = [
  { minScore: 26, maxScore: 30, scaleScore: '180–190', grade: 'Grade A', cefr: 'C1 Level', description: 'Outstanding listening capability across monologues, sentence completion, matching, and interviews. Exceeds B2 requirements and demonstrates C1 operational proficiency.' },
  { minScore: 23, maxScore: 25, scaleScore: '173–179', grade: 'Grade B', cefr: 'B2 High', description: 'Very strong B2 capability. Excellent at handling complex distractors and rapid native pacing.' },
  { minScore: 20, maxScore: 22, scaleScore: '166–172', grade: 'Grade C', cefr: 'B2 Standard', description: 'Solid B2 passing performance for Cambridge First for Schools certification.' },
  { minScore: 17, maxScore: 19, scaleScore: '160–165', grade: 'Pass at B2', cefr: 'B2 Threshold', description: 'Meets the Cambridge standard benchmark for B2 First for Schools certification.' },
  { minScore: 13, maxScore: 16, scaleScore: '140–159', grade: 'Level B1', cefr: 'B1 Independent', description: 'Candidate demonstrated ability at CEFR B1 level (just below the B2 certification threshold).' },
  { minScore: 0, maxScore: 12, scaleScore: 'Below 140', grade: 'Unclassified', cefr: 'Below B1', description: 'Requires continued practice in tracking distractors, gap-fill precision, and listening for agreement.' },
];