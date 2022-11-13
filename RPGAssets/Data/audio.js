const audio = {
    Map: new Howl({
        src: './RPGAssets/Audio/map.wav', 
        html5: true,
        volume: 0.1
    }),
    InitBattle: new Howl({
        src: './RPGAssets/Audio/initBattle.wav', 
        html5: true,
        volume: 0.1
    }),
    Battle: new Howl({
        src: './RPGAssets/Audio/battle.mp3', 
        html5: true,
        volume: 0.1
    }),
    TackleHit: new Howl({
        src: './RPGAssets/Audio/tackleHit.wav', 
        html5: true,
        volume: 0.1
    }),
    Victory: new Howl({
        src: './RPGAssets/Audio/victory.wav', 
        html5: true,
        volume: 0.1
    })
}