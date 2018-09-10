const gen = () => {

  let phrases = [];

  phrases[0] = [
    'Traffic',
    'Avg. CPC',
    'AOV',
    'CPA',
    'Clicks',
    'Cost',
    'Revenue',
    'Impressions',
    'ATIS',
    'Conv%',
    'Engagement Rate',
    'CTR',
    'ERS',
    'Non-brand Exact Match HVKs revenue (looking at first click revenue, not last click)',
    'Search queries containing the term "cheddar cheese"',
    'Google\'s new account health rating',
    'The split between mobile and desktop'
  ];

  phrases[1] = [
    'fell',
    'dropped off a cliff',
    'increased by 15%',
    'increased',
    'doubled',
    'halved',
    'remained flat',
    'grew by 3pp',
    'improved',
    'grew by an outrageous amount',
    'did not get significantly worse'
  ];

  phrases[2] = [
    'day-on-day',
    'period-on-period',
    'week-on-week',
    'QoQ',
    'hour-on-hour',
    ' - at least that is what my gut tells me - ',
    'compared to our \'mystery client\' (who shall remain anonymous)',
    'compared to our finger-in-the-air forecast',
    'compared to our worst estimate',
    'compared to our most extreme prediction',
    'comapred to our agency benchmark'
  ];


  phrases[3] = [
    'I think because',
    'because of the fact that',
    'almost certainly because',
    'because',
    'due to the fact that',
    'despite the fact that',
    'regardless of the fact that',
    'for reasons probably unrelated to the fact that'
  ]

  phrases[4] = [
    'the weather was slightly different to what we expected',
    'the World Cup final was on',
    'a routine recurring task went fatally wrong',
    'competitor activity spiked',
    'the KPO has been malfunctioning',
    'there has been Brexit uncertainty',
    'Amazon went on sale',
    'Wales was lost to a zombie outbreak',
    'Bing suddenly got popular',
    'Google now has complete control over our bids',
    'the feed has been uploaded empty',
    'Apple added an adblocker to the latest Safari release',
    'a team of the smartest minds at the agency have been working on your account',
    'a script has gone haywire',
    'your AdWords account has gained sentience and is refusing to cooperate',
    'Microsoft Cortana has taken over and <code>everything is fine</code>',
    'the high street is dying',
    'Facebook bought Google',
    'Google changed what exact-match is again',
    'we banned your competitors from Google using some trickery',
    'the conversion pixel was accidentally installed on the \'order failed\' page',
    'Google bought Microsoft',
    'the internet went down for 3 hours last Sunday',
    'there was a bug in my Excel spreadsheet',
    'teenagers now use your brand name as slang for genetalia',
    'we spent too much time clicking on your competitors ads',
    'you\'ve added garish watermarks to all your product images',
    'you\'ve pivoted into the cryptocurrency market',
    'we replaced all keywords with dynamic search ads',
    'we are now only using broad match',
    'our plan to restructure for SKAGs took longer than expected',
    'we replaced the account manager with a drinking bird toy',
    'we\'ve cancelled our inter-agency ping-pong tournament',
    'we based our bid optimisations on the game of \'deal-or-no-deal\' we once watched',
    'the attribution model we\'ve been told to used is called \'random click\'',
    'Google have redesigned the interface yet again and noone know how to do anything anymore'
  ];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const str = phrases.map(pick).join(" ").trim() + ".";

  $('#op').html(str);

}

$(() => {

  gen();

  $('#btn').click(gen);
  
});
