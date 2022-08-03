module.exports {
  layers: [
    {
      name: "Backgrounds",
      probability: 1.0,
      options: [
        {
          name: "Blue",
          file: "Backgrounds/blue_1.png",
          weight: 1
        },
        {
          name: "Pink",
          file: "Backgrounds/pink_2.png",
          weight: 1
        },
        {
          name: "Red",
          file: "Backgrounds/red_3.png",
          weight: 1
        },
      ]
    },

    {
      name: "Border",
      probability: 1.0,
      options: [
        {
          name: "Blue",
          file: "Border/Border1.png",
          weight: 1
        },
        {
          name: "Pink",
          file: "Border/Border2.png",
          weight: 1
        },
        {
          name: "Red",
          file: "Border/Border3.png",
          weight: 1
        },
      ]
    }
  ]
}
