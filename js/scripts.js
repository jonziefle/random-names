var RandomNameGenerator = (function () {
    // data from https://en.wikipedia.org/wiki/Letter_frequency
    var simpleLetterFrequency = {
        "english": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            "frequency": {
                "all": [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.36, 0.15, 1.974, 0.074]
            },
            "cumulative": {}
        },
        "french": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "à", "â", "œ", "ç", "è", "é", "ê", "ë", "î", "ï", "ô", "ù", "û"],
            "frequency": {
                "all": [7.636, 0.901, 3.26, 3.669, 14.715, 1.066, 0.866, 0.737, 7.529, 0.613, 0.049, 5.456, 2.968, 7.095, 5.796, 2.521, 1.362, 6.693, 7.948, 7.244, 6.311, 1.838, 0.074, 0.427, 0.128, 0.326, 0.486, 0.051, 0.018, 0.085, 0.271, 1.504, 0.218, 0.008, 0.045, 0.005, 0.023, 0.058, 0.06]
            },
            "cumulative": {}
        },
        "german": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "ä", "ö", "ß", "ü"],
            "frequency": {
                "all": [6.516, 1.886, 2.732, 5.076, 16.396, 1.656, 3.009, 4.577, 6.55, 0.268, 1.417, 3.437, 2.534, 9.776, 2.594, 0.67, 0.018, 7.003, 7.27, 6.154, 4.166, 0.846, 1.921, 0.034, 0.039, 1.134, 0.578, 0.443, 0.307, 0.995]
            },
            "cumulative": {}
        },
        "spanish": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "á", "é", "í", "ñ", "ó", "ú", "ü"],
            "frequency": {
                "all": [11.525, 2.215, 4.019, 5.01, 12.181, 0.692, 1.768, 0.703, 6.247, 0.493, 0.011, 4.967, 3.157, 6.712, 8.683, 2.51, 0.877, 6.871, 7.977, 4.632, 2.927, 1.138, 0.017, 0.215, 1.008, 0.467, 0.502, 0.433, 0.725, 0.311, 0.827, 0.168, 0.012]
            },
            "cumulative": {}
        },
        "portuguese": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "à", "â", "á", "ã", "ç", "é", "ê", "í", "ô", "ó", "õ", "ú", "ü"],
            "frequency": {
                "all": [14.634, 1.043, 3.882, 4.992, 12.57, 1.023, 1.303, 0.781, 6.186, 0.397, 0.015, 2.779, 4.738, 4.446, 9.735, 2.523, 1.204, 6.53, 6.805, 4.336, 3.639, 1.575, 0.037, 0.253, 0.006, 0.47, 0.072, 0.562, 0.118, 0.733, 0.53, 0.337, 0.45, 0.132, 0.635, 0.296, 0.04, 0.207, 0.026]
            },
            "cumulative": {}
        },
        "esperanto": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "z", "ĉ", "ĝ", "ĥ", "ĵ", "ŝ", "ŭ"],
            "frequency": {
                "all": [12.117, 0.98, 0.776, 3.044, 8.995, 1.037, 1.171, 0.384, 10.012, 3.501, 4.163, 6.104, 2.994, 7.955, 8.779, 2.755, 5.914, 6.092, 5.276, 3.183, 1.904, 0.494, 0.657, 0.691, 0.022, 0.055, 0.385, 0.52]
            },
            "cumulative": {}
        },
        "italian": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "à", "è", "ì", "ò", "ù"],
            "frequency": {
                "all": [11.745, 0.927, 4.501, 3.736, 11.792, 1.153, 1.644, 0.636, 10.143, 0.011, 0.009, 6.51, 2.512, 6.883, 9.832, 3.056, 0.505, 6.367, 4.981, 5.623, 3.011, 2.097, 0.033, 0.003, 0.02, 1.181, 0.635, 0.263, 0.03, 0.002, 0.166]
            },
            "cumulative": {}
        },
        "swedish": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "å", "ä", "ö"],
            "frequency": {
                "all": [9.383, 1.535, 1.486, 4.702, 10.149, 2.027, 2.862, 2.09, 5.817, 0.614, 3.14, 5.275, 3.471, 8.542, 4.482, 1.839, 0.02, 8.431, 6.59, 7.691, 1.919, 2.415, 0.142, 0.159, 0.708, 0.07, 1.338, 1.797, 1.305]
            },
            "cumulative": {}
        },
        "polish": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "w", "x", "y", "z", "ą", "ć", "ę", "ł", "ń", "ó", "ś", "ź", "ż"],
            "frequency": {
                "all": [10.503, 1.74, 3.895, 3.725, 7.352, 0.143, 1.731, 1.015, 8.328, 1.836, 2.753, 2.564, 2.515, 6.237, 6.667, 2.445, 5.243, 5.224, 2.475, 2.062, 0.012, 5.813, 0.004, 3.206, 4.852, 0.699, 0.743, 1.035, 2.109, 0.362, 1.141, 0.814, 0.078, 0.706]
            },
            "cumulative": {}
        },
        "dutch": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            "frequency": {
                "all": [7.486, 1.584, 1.242, 5.933, 18.91, 0.805, 3.403, 2.38, 6.499, 1.46, 2.248, 3.568, 2.213, 10.032, 6.063, 1.57, 0.009, 6.411, 3.73, 6.79, 1.99, 2.85, 1.52, 0.036, 0.035, 1.39]
            },
            "cumulative": {}
        },
        "danish": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "å", "æ", "ø"],
            "frequency": {
                "all": [6.025, 2, 0.565, 5.858, 15.453, 2.406, 4.077, 1.621, 6, 0.73, 3.395, 5.229, 3.237, 7.24, 4.636, 1.756, 0.007, 8.956, 5.805, 6.862, 1.979, 2.332, 0.069, 0.028, 0.698, 0.034, 1.19, 0.872, 0.939]
            },
            "cumulative": {}
        },
        "icelandic": {
            "letters": ["a", "b", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "x", "y", "á", "æ", "ð", "é", "í", "ö", "ó", "þ", "ú", "ý"],
            "frequency": {
                "all": [10.11, 1.043, 1.575, 6.418, 3.013, 4.241, 1.871, 7.578, 1.144, 3.314, 4.532, 4.041, 7.711, 2.166, 0.789, 8.581, 5.63, 4.953, 4.562, 2.437, 0.046, 0.9, 1.799, 0.867, 4.393, 0.647, 1.57, 0.777, 0.994, 1.455, 0.613, 0.228]
            },
            "cumulative": {}
        },
        "finnish": {
            "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "å", "ä", "ö"],
            "frequency": {
                "all": [12.217, 0.281, 0.281, 1.043, 7.968, 0.194, 0.392, 1.851, 10.817, 2.042, 4.973, 5.761, 3.202, 8.826, 5.614, 1.842, 0.013, 2.872, 7.862, 8.75, 5.008, 2.25, 0.094, 0.031, 1.745, 0.051, 0.003, 3.577, 0.444]
            },
            "cumulative": {}
        }
    };

    // data from http://www.prooffreader.com/2014/09/how-often-does-given-letter-follow.html
    var complexLetterFrequency = {
        "english": {
            "letters": ["_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            "frequency": {
                "_": [0, 11.2916, 4.6829, 4.3866, 3.163, 2.2002, 3.872, 1.929, 6.3504, 6.9082, 0.5511, 0.5942, 2.5855, 3.9895, 2.2918, 6.6238, 3.3662, 0.2015, 2.3535, 7.0906, 15.786, 1.1206, 0.6261, 6.6659, 0.0117, 1.3312, 0.0268],
                "a": [7.838, 0.0212, 2.0489, 3.8506, 4.5604, 0.0796, 0.7999, 1.8872, 0.1884, 4.0138, 0.082, 1.3522, 8.2572, 2.7549, 19.9778, 0.0318, 1.7388, 0.0157, 10.2436, 9.377, 13.2653, 1.2347, 2.4139, 0.8311, 0.1255, 2.841, 0.1695],
                "b": [1.2848, 8.466, 0.8961, 0.0628, 0.0747, 31.1857, 0.0053, 0.0055, 0.0251, 4.7625, 0.7658, 0.0027, 11.353, 0.1285, 0.0418, 11.4886, 0.0087, 0.0002, 6.7429, 1.694, 0.7668, 12.4597, 0.1501, 0.0292, 0.0009, 7.5973, 0.0015],
                "c": [2.4175, 13.1877, 0.0156, 1.7597, 0.0315, 15.821, 0.0053, 0.0217, 15.9781, 5.7198, 0.0004, 5.3974, 3.802, 0.0136, 0.0241, 18.8694, 0.0079, 0.1452, 3.9638, 0.3555, 8.2393, 3.3522, 0.0023, 0.003, 0.0006, 0.8457, 0.0196],
                "d": [59.443, 3.0776, 0.0383, 0.0363, 0.9624, 12.8484, 0.0853, 0.5848, 0.0606, 7.4666, 0.0575, 0.0174, 0.8539, 0.3515, 0.1685, 6.0509, 0.0199, 0.0185, 1.9382, 2.4252, 0.0442, 1.7494, 0.3135, 0.1746, 0.0001, 1.2102, 0.0031],
                "e": [35.8627, 4.7951, 0.1638, 2.1501, 7.8552, 2.8732, 0.92, 0.6028, 0.1678, 1.1118, 0.0273, 0.1662, 3.3894, 2.0583, 8.4461, 0.3737, 1.0107, 0.1769, 13.1465, 7.1479, 2.6621, 0.1319, 1.5882, 0.8174, 0.9855, 1.3281, 0.0413],
                "f": [38.7264, 6.5323, 0.0157, 0.0146, 0.0087, 8.0547, 4.6926, 0.0148, 0.0073, 8.3791, 0.001, 0.005, 2.5135, 0.0144, 0.0088, 16.1256, 0.0033, 0.0001, 7.6881, 0.1618, 3.381, 3.4221, 0.0007, 0.0146, 0.0004, 0.2135, 0.0002],
                "g": [34.3242, 6.3043, 0.0253, 0.0035, 0.0752, 14.2359, 0.03, 1.2333, 12.3279, 5.4385, 0.0009, 0.0048, 2.8162, 0.2127, 1.8596, 7.5225, 0.01, 0.0006, 7.2333, 2.2586, 0.6101, 2.9362, 0.0021, 0.0513, 0.0001, 0.4789, 0.0039],
                "h": [10.0514, 15.6225, 0.0749, 0.0128, 0.0384, 47.415, 0.0459, 0.0023, 0.0119, 12.8164, 0.0005, 0.0049, 0.1549, 0.1403, 0.2311, 7.4785, 0.0058, 0.0045, 1.1828, 0.1993, 2.651, 1.1776, 0.0034, 0.0585, 0, 0.6149, 0.0003],
                "i": [4.0487, 2.0859, 0.7416, 5.8938, 3.9973, 3.8569, 2.2043, 3.0043, 0.0126, 0.0883, 0.0079, 0.7928, 5.1666, 3.7905, 26.1049, 5.6729, 0.8295, 0.0608, 3.7321, 11.9087, 12.7881, 0.1239, 2.3747, 0.0064, 0.2011, 0.0029, 0.5023],
                "j": [0.1779, 13.9073, 0.0077, 0.0273, 0.0119, 20.1939, 0.0135, 0.0045, 0.011, 2.7017, 0.0159, 0.0062, 0.0149, 0.0053, 0.0218, 27.839, 0.0191, 0.0002, 0.2273, 0.0125, 0.0122, 34.733, 0.0038, 0.0012, 0.0003, 0.0287, 0.0019],
                "k": [31.2921, 1.8798, 0.1006, 0.0224, 0.0493, 32.9005, 0.2699, 0.1165, 0.2627, 13.2558, 0.0104, 0.0479, 1.8022, 0.1598, 8.7438, 0.7791, 0.0647, 0.0007, 0.265, 6.1593, 0.1127, 0.2954, 0.011, 0.2802, 0.0009, 1.1172, 0.0002],
                "l": [15.4867, 9.3176, 0.1346, 0.1694, 6.7396, 16.2708, 1.2993, 0.0975, 0.027, 11.989, 0.001, 0.709, 13.0957, 0.5407, 0.1011, 7.8656, 0.4076, 0.0011, 0.2536, 2.1854, 1.7987, 1.9246, 0.5967, 0.356, 0.002, 8.6205, 0.0092],
                "m": [15.3159, 16.6985, 2.5193, 0.1708, 0.012, 25.8762, 0.1749, 0.0083, 0.0143, 9.5804, 0.001, 0.0031, 0.1626, 2.4642, 0.3365, 11.1505, 5.5377, 0.0003, 0.1483, 2.586, 0.0418, 3.5182, 0.0059, 0.0162, 0.0011, 3.6523, 0.004],
                "n": [26.8235, 2.8414, 0.0607, 3.7036, 16.2596, 8.4792, 0.5551, 11.997, 0.1162, 3.2741, 0.1071, 0.948, 0.8311, 0.2318, 0.9365, 6.0548, 0.0481, 0.0804, 0.1044, 4.3072, 9.6382, 0.6608, 0.4372, 0.0826, 0.0412, 1.3462, 0.0338],
                "o": [13.9545, 0.6937, 0.818, 1.1744, 1.7787, 0.4455, 10.4681, 0.5816, 0.2934, 0.9958, 0.0352, 1.1419, 3.2911, 5.6053, 14.8427, 3.3582, 1.9607, 0.0157, 11.8773, 2.8345, 4.7322, 12.1979, 1.8787, 4.4097, 0.1086, 0.4519, 0.0547],
                "p": [7.6534, 12.0661, 0.0601, 0.0211, 0.0151, 18.2573, 0.0398, 0.0132, 2.6832, 5.5309, 0.0017, 0.041, 9.622, 0.2533, 0.0309, 12.8815, 5.6947, 0.0002, 14.7445, 2.3035, 3.4089, 4.1395, 0.0013, 0.056, 0.002, 0.4761, 0.0025],
                "q": [0.7683, 0.1378, 0.0226, 0.0042, 0.0027, 0.0075, 0.0012, 0.0002, 0.0021, 0.1827, 0.0004, 0.0013, 0.0033, 0.0028, 0.0088, 0.0095, 0.0043, 0.007, 0.0083, 0.0156, 0.0094, 98.7021, 0.0092, 0.0774, 0.0103, 0.0004, 0.0004],
                "r": [22.6864, 7.2637, 0.3032, 1.1893, 2.6604, 22.7996, 0.3709, 1.0997, 0.2282, 8.4086, 0.0085, 1.2124, 1.2828, 1.7273, 2.2456, 8.8944, 0.4735, 0.012, 1.7232, 5.1668, 4.3761, 1.7105, 0.6679, 0.2004, 0.0049, 3.2753, 0.0085],
                "s": [40.8033, 3.851, 0.1187, 1.5612, 0.0644, 10.5846, 0.1469, 0.0421, 5.6153, 5.5829, 0.002, 0.6891, 0.9028, 0.777, 0.189, 4.9748, 2.187, 0.1203, 0.0474, 4.6332, 12.957, 3.2001, 0.0097, 0.4898, 0.0003, 0.4456, 0.0042],
                "t": [24.3864, 3.8543, 0.0272, 0.3547, 0.0072, 8.8716, 0.0727, 0.0141, 32.1557, 7.7651, 0.001, 0.0047, 1.1775, 0.1757, 0.0978, 9.9224, 0.0149, 0.0001, 2.9944, 2.3782, 1.8629, 1.7097, 0.0124, 0.6019, 0.0224, 1.4809, 0.0343],
                "u": [6.2219, 2.5367, 2.1315, 4.308, 2.2776, 3.3189, 0.5927, 4.8449, 0.0507, 2.656, 0.0077, 0.1113, 10.2384, 2.9313, 11.7297, 0.2297, 4.6971, 0.0107, 14.0398, 12.5663, 14.0016, 0.0108, 0.0737, 0.0069, 0.0876, 0.2189, 0.0995],
                "v": [0.5489, 7.7973, 0.0005, 0.0077, 0.0119, 68.6132, 0.0009, 0.0031, 0.0075, 16.9135, 0.002, 0.0034, 0.0288, 0.0017, 0.015, 5.133, 0.0048, 0, 0.0724, 0.0373, 0.0046, 0.1716, 0.018, 0.0017, 0.0001, 0.6009, 0.0001],
                "w": [11.0773, 20.9362, 0.059, 0.0189, 0.2646, 15.6597, 0.1057, 0.0053, 17.8341, 16.1675, 0.0007, 0.0789, 0.6718, 0.0357, 4.0055, 10.1075, 0.026, 0.0041, 1.1742, 1.4022, 0.1191, 0.0709, 0.0013, 0.0029, 0.0002, 0.1699, 0.0009],
                "x": [12.4026, 8.0969, 0.073, 12.342, 0.0033, 8.2386, 0.2256, 0.0074, 1.9345, 11.1608, 0.0009, 0.0083, 0.1862, 0.0544, 0.0158, 1.1276, 23.2083, 0.2903, 0.0076, 0.0374, 17.2902, 1.4389, 0.5012, 0.134, 0.6444, 0.5634, 0.0064],
                "y": [71.2483, 0.7031, 0.4417, 0.2311, 0.1753, 5.579, 0.0548, 0.0562, 0.0567, 1.5627, 0.0017, 0.0221, 0.4968, 0.6497, 0.379, 12.6087, 0.3924, 0.0008, 0.2618, 3.8244, 0.8702, 0.0536, 0.0132, 0.2655, 0.0079, 0.0065, 0.0367],
                "z": [7.8753, 15.5768, 0.1589, 0.0771, 0.045, 45.3189, 0.0113, 0.2174, 0.4359, 12.0233, 0.0082, 0.1323, 2.4932, 0.1707, 0.1182, 4.8278, 0.0748, 0.0126, 0.2341, 0.1098, 0.1784, 1.153, 0.2362, 0.1065, 0.0078, 3.0566, 5.3399]


            },
            "cumulative": {}
        }
    };

    // global variables
    var simpleNames = $(".name-generator[data-name-type='simple']");
    var complexNames = $(".name-generator[data-name-type='complex']");

    // capitalize the first letter of a string
    function capitalizeLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // generate random integer in a given range (inclusive)
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // populate the select languages
    function populateLanguageSelect(parent, letterFrequency) {
        var selectHTML = "";
        $.each(letterFrequency["frequency"], function (key, value) {
            if (key !== "_") {
                selectHTML += "<option value='" + key + "'>" + capitalizeLetter(key) + "</option>";
            }
        });
        parent.find(".selector").append(selectHTML);
    }

    // generates cumulative distributions from the individual letter frequencies
    function generateCumulativeDistributions(letterFrequency) {
        $.each(letterFrequency["frequency"], function (language, frequencyArray) {
            var cumulativeArray = [];
            var sum = 0;
            frequencyArray.forEach(function (frequency) {
                sum += parseInt(frequency * 10000);
                cumulativeArray.push(sum);
            });
            letterFrequency["cumulative"][language] = cumulativeArray;
        });
    }

    // generate simple names
    function generateSimpleName(selectValue) {
        // generate word length
        var letterRange = randomInt(3, 10);

        // determine language
        var language;
        if (selectValue === "random") {
            var keys = Object.keys(simpleLetterFrequency["frequency"]);
            language = keys[Math.floor(Math.random() * keys.length)];
        } else {
            language = selectValue;
        }

        // generate random letters
        var name = "";
        for (var i = 0; i < letterRange; i++) {
            name += generateLetter(language, simpleLetterFrequency);
        }

        simpleNames.find(".name-results").html(displayResults(name, language, "simple", simpleLetterFrequency));
    }

    // generate complex names
    function generateComplexName(selectValue) {
        // generate word length
        var letterRange = randomInt(3, 10);

        // generate first letter
        var name = "";
        var currentLetter;
        if (selectValue === "random") {
            currentLetter = generateLetter("_", complexLetterFrequency);
        } else {
            currentLetter = selectValue;
        }
        name += currentLetter;

        // generate remaining letters
        var tempLetter;
        for (var i = 1; i < letterRange; i++) {
            do {
                tempLetter = generateLetter(currentLetter, complexLetterFrequency);
            } while (tempLetter === "_");

            currentLetter = tempLetter;
            name += currentLetter;
        }

        complexNames.find(".name-results").html(displayResults(name, "english", "complex", complexLetterFrequency));
    }

    // generate single letter
    function generateLetter(category, letterFrequency) {
        var letters = letterFrequency["letters"];
        var frequency = letterFrequency["frequency"][category];
        var cumulative = letterFrequency["cumulative"][category];

        var randomMax = cumulative[cumulative.length - 1];
        var randomLetter = Math.floor(Math.random() * randomMax);

        for (i = 0; i < letters.length; i++) {
            if (frequency[i] > 0 && randomLetter < cumulative[i]) {
                var currentLetter = letters[i];
                break;
            }
        }

        return currentLetter;
    }

    // display name results
    function displayResults(name, language, type, letterFrequency) {
        var letters = letterFrequency["letters"];
        var frequency = letterFrequency["frequency"];

        var html = "";
        html += "<p>Name: " + capitalizeLetter(name) + "</p>";
        html += "<p>Language: " + capitalizeLetter(language) + "</p>";

        var statistics = "";
        if (type === "simple") {
            for (var i = 0; i < name.length; i++) {
                statistics += capitalizeLetter(name[i]) + ": ";
                statistics += frequency[language][letters.indexOf(name[i])].toFixed(2) + "%";
                if (i < name.length - 1) {
                    statistics += " | ";
                }
            }
        } else {
            // first letter
            statistics += capitalizeLetter(name[0]) + ": ";
            statistics += frequency["_"][letters.indexOf(name[0])].toFixed(2) + "%";
            statistics += " | ";

            // remaining letters
            for (var j = 1; j < name.length; j++) {
                statistics += capitalizeLetter(name[j]) + ": ";
                statistics += frequency[name[j - 1]][letters.indexOf(name[j])].toFixed(2) + "%";
                if (j < name.length - 1) {
                    statistics += " | ";
                }
            }
        }
        html += "<p>Letters: " + statistics + "</p>";

        return html;
    }

    return {
        init: function () {
            // populate dropdowns
            populateLanguageSelect(simpleNames, simpleLetterFrequency);
            populateLanguageSelect(complexNames, complexLetterFrequency);

            // generate cumulative distributions
            generateCumulativeDistributions(simpleLetterFrequency);
            generateCumulativeDistributions(complexLetterFrequency);

            // click handler for simple name generation
            simpleNames.on("click", ".submit-button", function () {
                var selectValue = simpleNames.find(".selector").val();

                if (selectValue === "random" ||
                    simpleLetterFrequency["frequency"].hasOwnProperty(selectValue)) {
                    generateSimpleName(selectValue);
                } else {
                    simpleNames.find(".name-results").html("<p>Please select a language!</p>");
                }
            });

            // click handler for complex name generation
            complexNames.on("click", ".submit-button", function () {
                var selectValue = complexNames.find(".selector").val();

                if (selectValue === "random" ||
                    complexLetterFrequency["frequency"].hasOwnProperty(selectValue)) {
                    generateComplexName(selectValue);
                } else {
                    complexNames.find(".name-results").html("<p>Please select a letter!</p>");
                }
            });
        },
        simpleLetterFrequency: simpleLetterFrequency,
        complexLetterFrequency: complexLetterFrequency
    }
})();
RandomNameGenerator.init();
