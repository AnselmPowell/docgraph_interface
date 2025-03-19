// src/app/components/svg/DocGraphLogo.client.jsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Sparkles,
} from 'lucide-react'; 
import '../../styles/svg-animation.css';

export function DocGraphLogo({ isAnimating = false, hasUser = false }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Initial activation
    setIsActive(true);

    // Handle re-animation trigger
    if (isAnimating) {
      setIsActive(false);
      requestAnimationFrame(() => {
        setIsActive(true);
      });
    }
  }, [isAnimating, hasUser]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <svg 
        className={`studygraph opacity-5 ${isActive ? 'active' : ''} ${hasUser ? 'user': ""}`}
        version="1.0" 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%" 
        height="100%" 
        viewBox="0 0 500.000000 500.000000" 
        preserveAspectRatio="xMidYMid meet"
      >


<g transform="translate(0.000000, 500.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
      <path d="M2416 4674 c-19 -18 -21 -65 -4 -82 7 -7 24 -12 38 -12 33 0 50 17 ..." />
    
<path d="M2416 4674 c-19 -18 -21 -65 -4 -82 7 -7 24 -12 38 -12 33 0 50 17
50 51 0 32 -23 59 -50 59 -10 0 -26 -7 -34 -16z" className="svg-elem-1 animate-hover">

</path>
<g className=" animate-hover">
{/* Sparkles */}
<g  transform="translate(1486,4374) scale(0.08,0.08)" fill="#000000" stroke="none">

<path className="svg-elem-7 animate-hover " d="M1632 3120 c-74 -16 -147 -72 -182 -140 -17 -33 -48 -148 -156 -570
-25 -96 -50 -190 -55 -207 -12 -39 20 -28 -429 -142 -349 -89 -375 -97 -438
-149 -66 -54 -86 -101 -87 -197 0 -94 22 -149 82 -206 50 -47 73 -55 378 -134
302 -77 443 -114 467 -121 21 -6 22 -10 108 -349 116 -456 116 -455 174 -522
52 -60 106 -83 194 -83 86 0 150 27 200 84 57 65 50 43 197 621 30 121 59 226
63 234 5 9 77 32 173 57 446 114 607 158 639 174 52 26 90 68 118 128 20 45
23 65 20 125 -6 114 -57 190 -155 235 -27 12 -210 63 -408 113 -198 50 -367
95 -376 100 -9 5 -19 21 -21 36 -3 16 -28 116 -56 223 -28 107 -69 266 -92
354 -47 182 -63 218 -120 270 -68 61 -150 84 -238 66z m105 -1064 c44 -154
168 -264 354 -316 40 -11 77 -24 81 -28 5 -5 -31 -19 -79 -32 -101 -26 -141
-45 -200 -92 -90 -72 -151 -178 -183 -321 -7 -32 -17 -54 -21 -50 -4 4 -17 44
-29 88 -29 106 -74 188 -135 250 -64 63 -127 97 -238 125 -48 13 -84 27 -79
32 4 4 35 15 68 23 138 35 269 126 328 227 13 24 37 86 51 138 15 52 30 99 33
104 3 5 11 -13 19 -40 7 -27 21 -76 30 -108z"/>
<path className="svg-elem-7" d="M2549 2977 c-59 -32 -99 -90 -107 -158 l-7 -54 -54 -7 c-241 -29
-241 -387 0 -416 l54 -7 7 -54 c13 -107 98 -181 208 -181 110 0 195 74 208
181 l7 54 54 7 c241 29 241 387 0 416 l-54 7 -7 54 c-13 107 -98 181 -208 181
-40 0 -70 -7 -101 -23z"/>
<path className="svg-elem-7 " d="M631 1298 c-24 -11 -56 -40 -73 -62 -16 -23 -48 -55 -72 -73 -115
-84 -115 -262 0 -346 24 -18 56 -51 73 -73 80 -112 262 -112 342 0 17 22 49
55 73 73 115 84 115 262 0 346 -24 18 -56 51 -73 73 -57 81 -177 108 -270 62z"/>
 </g> </g>


  <g  transform="translate(3896,2834) scale(0.06,0.06)" fill="#000000" stroke="none">
<path className="svg-elem-12" d="M1632 3120 c-74 -16 -147 -72 -182 -140 -17 -33 -48 -148 -156 -570
-25 -96 -50 -190 -55 -207 -12 -39 20 -28 -429 -142 -349 -89 -375 -97 -438
-149 -66 -54 -86 -101 -87 -197 0 -94 22 -149 82 -206 50 -47 73 -55 378 -134
302 -77 443 -114 467 -121 21 -6 22 -10 108 -349 116 -456 116 -455 174 -522
52 -60 106 -83 194 -83 86 0 150 27 200 84 57 65 50 43 197 621 30 121 59 226
63 234 5 9 77 32 173 57 446 114 607 158 639 174 52 26 90 68 118 128 20 45
23 65 20 125 -6 114 -57 190 -155 235 -27 12 -210 63 -408 113 -198 50 -367
95 -376 100 -9 5 -19 21 -21 36 -3 16 -28 116 -56 223 -28 107 -69 266 -92
354 -47 182 -63 218 -120 270 -68 61 -150 84 -238 66z m105 -1064 c44 -154
168 -264 354 -316 40 -11 77 -24 81 -28 5 -5 -31 -19 -79 -32 -101 -26 -141
-45 -200 -92 -90 -72 -151 -178 -183 -321 -7 -32 -17 -54 -21 -50 -4 4 -17 44
-29 88 -29 106 -74 188 -135 250 -64 63 -127 97 -238 125 -48 13 -84 27 -79
32 4 4 35 15 68 23 138 35 269 126 328 227 13 24 37 86 51 138 15 52 30 99 33
104 3 5 11 -13 19 -40 7 -27 21 -76 30 -108z"/>
<path className="svg-elem-12" d="M2549 2977 c-59 -32 -99 -90 -107 -158 l-7 -54 -54 -7 c-241 -29
-241 -387 0 -416 l54 -7 7 -54 c13 -107 98 -181 208 -181 110 0 195 74 208
181 l7 54 54 7 c241 29 241 387 0 416 l-54 7 -7 54 c-13 107 -98 181 -208 181
-40 0 -70 -7 -101 -23z"/>
<path className="svg-elem-12 " d="M631 1298 c-24 -11 -56 -40 -73 -62 -16 -23 -48 -55 -72 -73 -115
-84 -115 -262 0 -346 24 -18 56 -51 73 -73 80 -112 262 -112 342 0 17 22 49
55 73 73 115 84 115 262 0 346 -24 18 -56 51 -73 73 -57 81 -177 108 -270 62z"/>
  </g>


  <g  transform="translate(1076,2134) scale(0.06,0.06)" fill="#000000" stroke="none">
<path className="svg-elem-11 " d="M1632 3120 c-74 -16 -147 -72 -182 -140 -17 -33 -48 -148 -156 -570
-25 -96 -50 -190 -55 -207 -12 -39 20 -28 -429 -142 -349 -89 -375 -97 -438
-149 -66 -54 -86 -101 -87 -197 0 -94 22 -149 82 -206 50 -47 73 -55 378 -134
302 -77 443 -114 467 -121 21 -6 22 -10 108 -349 116 -456 116 -455 174 -522
52 -60 106 -83 194 -83 86 0 150 27 200 84 57 65 50 43 197 621 30 121 59 226
63 234 5 9 77 32 173 57 446 114 607 158 639 174 52 26 90 68 118 128 20 45
23 65 20 125 -6 114 -57 190 -155 235 -27 12 -210 63 -408 113 -198 50 -367
95 -376 100 -9 5 -19 21 -21 36 -3 16 -28 116 -56 223 -28 107 -69 266 -92
354 -47 182 -63 218 -120 270 -68 61 -150 84 -238 66z m105 -1064 c44 -154
168 -264 354 -316 40 -11 77 -24 81 -28 5 -5 -31 -19 -79 -32 -101 -26 -141
-45 -200 -92 -90 -72 -151 -178 -183 -321 -7 -32 -17 -54 -21 -50 -4 4 -17 44
-29 88 -29 106 -74 188 -135 250 -64 63 -127 97 -238 125 -48 13 -84 27 -79
32 4 4 35 15 68 23 138 35 269 126 328 227 13 24 37 86 51 138 15 52 30 99 33
104 3 5 11 -13 19 -40 7 -27 21 -76 30 -108z"/>
<path className="svg-elem-11 " d="M2549 2977 c-59 -32 -99 -90 -107 -158 l-7 -54 -54 -7 c-241 -29
-241 -387 0 -416 l54 -7 7 -54 c13 -107 98 -181 208 -181 110 0 195 74 208
181 l7 54 54 7 c241 29 241 387 0 416 l-54 7 -7 54 c-13 107 -98 181 -208 181
-40 0 -70 -7 -101 -23z"/>
<path className="svg-elem-11" d="M631 1298 c-24 -11 -56 -40 -73 -62 -16 -23 -48 -55 -72 -73 -115
-84 -115 -262 0 -346 24 -18 56 -51 73 -73 80 -112 262 -112 342 0 17 22 49
55 73 73 115 84 115 262 0 346 -24 18 -56 51 -73 73 -57 81 -177 108 -270 62z"/>
  </g>

{/* Brain */}
<path d="M2075 4565 c-70 -17 -124 -47 -166 -92 -50 -54 -60 -68 -74 -109 -11
-34 -15 -36 -61 -40 -104 -8 -208 -88 -235 -180 -8 -24 -18 -43 -23 -41 -5 2
-23 20 -40 40 -26 32 -28 40 -18 62 16 36 15 100 -3 135 -45 87 -164 78 -195
-14 -23 -70 21 -147 97 -168 36 -10 51 -21 66 -48 10 -19 30 -47 45 -62 14
-15 24 -29 21 -31 -2 -2 -25 -15 -50 -30 -93 -53 -168 -170 -177 -274 -3 -29
-8 -53 -12 -53 -4 0 -25 20 -47 45 -39 45 -39 46 -30 94 9 40 7 54 -9 87 -23
48 -76 84 -121 84 -51 0 -93 -47 -93 -105 0 -82 44 -135 117 -143 41 -4 51 -9
70 -38 l22 -34 -43 -19 c-24 -10 -46 -24 -50 -29 -5 -8 -15 -8 -33 -1 -39 15
-78 2 -113 -37 -40 -46 -39 -77 5 -121 31 -31 40 -35 68 -29 51 10 81 38 93
87 9 38 16 46 60 66 34 16 58 21 79 17 55 -12 58 -22 17 -73 -64 -78 -86 -143
-80 -244 2 -54 10 -87 32 -131 50 -102 160 -193 255 -212 26 -5 29 -11 33 -54
18 -183 247 -345 413 -290 32 11 39 10 58 -8 33 -30 95 -58 159 -72 100 -22
213 22 294 115 42 48 50 53 58 37 41 -72 131 -132 232 -153 74 -15 145 3 225
56 46 32 56 35 82 25 17 -5 59 -10 94 -10 152 0 301 140 320 300 5 42 9 49 33
53 59 12 140 60 190 113 71 75 102 149 104 244 1 92 -13 133 -70 207 -25 31
-43 64 -42 73 9 44 168 2 168 -45 0 -32 41 -87 73 -98 61 -20 117 21 117 86 0
21 -5 47 -11 59 -16 29 -74 51 -120 43 -29 -5 -45 -2 -66 13 -16 10 -36 22
-46 25 -17 6 -16 10 9 42 22 29 33 35 63 35 99 0 168 144 105 219 -22 26 -33
31 -71 31 -87 0 -137 -61 -131 -161 3 -54 0 -62 -32 -104 -19 -24 -38 -44 -42
-45 -5 0 -8 20 -8 44 0 23 -5 58 -12 77 -28 82 -135 203 -202 229 -30 11 -33
25 -8 39 9 5 32 30 51 55 19 25 41 46 48 46 29 0 95 42 113 73 32 51 26 103
-14 143 -28 28 -41 34 -77 34 -47 0 -78 -19 -99 -59 -15 -29 -15 -128 1 -147
8 -10 5 -21 -12 -46 -44 -62 -46 -63 -68 -12 -46 102 -120 164 -222 185 -53
11 -56 13 -83 65 -33 63 -101 127 -166 158 -37 17 -64 21 -145 21 -120 -1
-172 -21 -249 -98 l-48 -48 -34 40 c-43 50 -123 95 -192 110 -63 13 -81 13
-147 -4z m161 -77 c96 -26 174 -128 174 -229 l0 -51 -39 35 c-89 80 -218 87
-329 16 -45 -28 -46 -29 -66 -10 -12 10 -36 26 -53 35 -19 10 -33 24 -33 35 0
22 44 88 79 119 63 54 174 75 267 50z m589 1 c78 -22 159 -96 180 -166 5 -17
0 -25 -22 -37 -15 -8 -39 -24 -52 -37 -23 -21 -24 -21 -50 -5 -14 9 -46 27
-71 38 -90 42 -222 18 -297 -54 l-33 -32 0 55 c0 70 35 147 85 184 73 56 175
77 260 54z m-1424 -183 c17 -37 4 -76 -26 -76 -25 0 -55 33 -55 60 0 43 63 55
81 16z m2167 12 c21 -21 14 -66 -13 -84 -38 -25 -59 -15 -63 29 -2 21 2 45 9
53 14 17 51 18 67 2z m-1697 -82 c19 -8 44 -25 56 -38 l22 -24 -25 -64 c-37
-91 -38 -184 -1 -264 21 -46 26 -67 21 -100 -15 -97 -91 -168 -162 -149 -21 5
-22 11 -22 93 0 63 4 91 14 99 36 30 27 87 -20 117 -30 20 -64 9 -90 -31 -14
-21 -14 -30 -4 -54 6 -16 18 -32 26 -35 18 -7 19 -152 2 -211 -6 -22 -16 -71
-22 -109 l-11 -70 -54 45 c-86 70 -96 89 -96 175 0 68 2 76 28 99 43 41 33 84
-17 71 -14 -3 -33 -25 -51 -58 -24 -44 -29 -65 -28 -118 0 -104 55 -189 167
-264 43 -29 90 -91 81 -106 -3 -6 -14 -10 -24 -10 -9 0 -22 -5 -27 -10 -6 -6
-33 -13 -61 -17 -42 -5 -58 -2 -87 17 -38 23 -39 25 -36 82 1 27 -4 39 -19 47
-37 20 -60 13 -78 -23 l-16 -35 39 -56 c71 -103 144 -126 274 -84 64 21 97 21
129 0 13 -8 13 -15 1 -50 -41 -126 75 -292 228 -326 87 -18 213 23 220 73 5
33 -24 38 -68 13 -97 -54 -241 -5 -296 102 -24 46 -29 119 -10 155 24 47 20
58 -34 88 -65 35 -93 91 -94 184 0 36 4 82 8 103 7 37 7 37 45 31 81 -13 183
61 219 159 10 26 22 48 25 48 4 0 22 -3 40 -6 46 -9 98 15 133 60 23 31 29 49
32 104 2 36 10 83 19 104 13 29 14 42 5 62 -15 33 -56 49 -85 33 -52 -27 -59
-65 -22 -110 29 -34 33 -81 11 -133 -27 -64 -94 -71 -145 -16 -93 101 -47 315
82 383 51 27 146 30 193 5 36 -18 90 -77 107 -116 12 -26 28 -681 17 -681 -3
0 -14 6 -25 13 -11 8 -45 24 -76 36 -67 27 -100 58 -105 101 -5 41 -11 50 -35
50 -51 0 -40 -103 17 -157 19 -17 34 -34 34 -38 0 -8 -17 -29 -60 -75 -66 -70
-172 -60 -208 19 -21 45 -31 52 -54 40 -50 -27 9 -128 94 -164 81 -33 160 -5
241 86 63 73 85 75 139 19 l38 -41 0 -113 c0 -62 3 -142 7 -177 l6 -64 -49 50
c-53 54 -101 75 -174 75 -27 0 -51 7 -67 20 -31 24 -51 25 -81 4 -27 -18 -30
-69 -5 -96 20 -22 66 -23 84 -2 11 13 24 15 67 10 102 -12 159 -64 192 -174
19 -65 19 -72 5 -113 -47 -132 -217 -198 -341 -133 -27 14 -61 37 -76 51 -25
24 -29 25 -60 12 -18 -8 -62 -14 -98 -14 -54 0 -74 5 -120 31 -104 58 -159
164 -147 281 l6 55 -53 -7 c-65 -8 -124 16 -185 76 -78 75 -107 180 -81 290
11 44 23 63 66 104 l52 51 -19 69 c-24 84 -19 138 18 210 46 90 124 141 251
166 34 6 62 15 62 19 0 30 -15 40 -56 40 -48 0 -50 3 -32 61 15 52 73 117 122
140 49 22 121 24 167 5z m1314 -4 c69 -43 125 -122 125 -178 0 -18 -6 -23 -31
-26 -37 -3 -62 -33 -40 -47 7 -5 38 -11 68 -15 108 -13 191 -76 241 -184 22
-49 24 -63 19 -136 -4 -44 -9 -92 -13 -106 -4 -21 4 -34 44 -76 107 -107 105
-253 -4 -374 -52 -57 -123 -90 -196 -90 l-57 0 6 -53 c11 -112 -51 -227 -152
-280 -53 -27 -164 -29 -214 -3 -31 17 -35 17 -43 2 -43 -78 -174 -116 -278
-81 -67 22 -117 67 -146 130 -29 62 -30 90 -3 152 37 87 102 136 196 149 41 5
51 3 56 -10 8 -20 70 -22 86 -3 23 29 24 74 2 96 -24 24 -63 28 -80 7 -6 -7
-38 -16 -71 -19 -71 -6 -130 -37 -183 -96 l-37 -41 0 178 c0 192 2 201 58 240
54 38 69 37 96 -7 94 -148 238 -174 339 -62 41 45 51 103 21 115 -22 8 -32 0
-48 -39 -19 -44 -55 -67 -108 -67 -59 -1 -100 22 -137 78 l-31 47 40 43 c60
65 65 144 9 144 -21 0 -41 -32 -33 -53 3 -8 -6 -28 -20 -44 -25 -29 -38 -38
-131 -79 -22 -10 -44 -20 -48 -22 -4 -2 -7 147 -5 331 l3 335 30 43 c47 67
112 102 189 103 53 1 70 -4 112 -29 75 -47 107 -106 112 -210 4 -72 1 -89 -19
-130 -56 -112 -159 -92 -172 33 -5 49 -3 60 15 79 25 27 28 77 6 99 -8 8 -30
16 -48 16 -57 2 -90 -62 -55 -108 8 -11 14 -41 15 -72 0 -68 18 -109 64 -150
44 -38 77 -48 121 -35 l33 11 7 -43 c7 -53 50 -114 101 -146 29 -17 53 -23 98
-24 l60 0 9 -40 c4 -22 7 -77 5 -122 -4 -100 -22 -129 -96 -158 -28 -11 -53
-25 -56 -31 -2 -5 7 -34 21 -62 19 -40 23 -61 18 -90 -16 -97 -95 -168 -198
-179 -48 -5 -62 -2 -101 21 -40 24 -46 25 -60 10 -20 -19 -20 -24 -2 -50 22
-30 117 -58 176 -51 159 19 286 188 245 323 -8 27 -15 49 -15 50 0 0 18 6 39
12 33 10 49 9 102 -8 124 -39 204 -19 277 67 46 55 54 94 25 125 -36 40 -102
5 -89 -47 4 -15 4 -35 1 -45 -7 -23 -63 -50 -104 -50 -31 0 -120 26 -134 39
-4 4 2 25 12 47 13 27 38 51 81 79 156 100 207 290 105 392 -36 36 -65 42 -86
17 -11 -13 -8 -19 19 -40 53 -42 65 -140 25 -217 -17 -33 -68 -84 -104 -102
l-25 -14 -17 92 c-20 111 -25 286 -8 296 6 4 14 24 18 44 4 29 1 40 -20 61
-33 33 -62 33 -92 0 -30 -33 -32 -63 -5 -97 16 -21 20 -40 20 -110 0 -96 -8
-105 -74 -93 -57 11 -101 71 -111 152 -6 41 -3 57 19 100 36 72 36 183 1 269
l-24 59 22 24 c48 52 155 69 212 34z m-2104 -348 c26 -13 30 -20 27 -52 -2
-29 -8 -38 -25 -40 -29 -4 -63 31 -63 66 0 46 13 51 61 26z m2797 -21 c4 -39
-28 -76 -61 -71 -33 5 -36 59 -5 87 33 31 62 24 66 -16z m33 -323 c22 -12 25
-33 6 -48 -10 -9 -19 -7 -35 4 -31 21 -28 45 6 53 2 1 12 -4 23 -9z m-2893
-22 c-3 -25 -34 -36 -50 -20 -17 17 -1 42 27 42 22 0 26 -4 23 -22z" className="svg-elem-2 animate-hover" ></path>


<path d="M1722 4128 c-35 -35 15 -99 53 -68 30 25 12 80 -25 80 -9 0 -21 -5
-28 -12z" className="svg-elem-3 animate-hover"></path>
<path d="M1734 2806 c-12 -31 0 -51 31 -51 27 0 30 3 30 30 0 25 -4 30 -28 33
-17 2 -29 -2 -33 -12z" className="svg-elem-4 animate-hover"></path>
<path d="M3110 4125 c-20 -24 3 -65 34 -65 36 0 53 35 30 61 -21 23 -47 25
-64 4z" className="svg-elem-5 animate-hover"></path>
<path d="M3104 2806 c-12 -31 1 -51 33 -54 25 -2 33 1 38 18 4 12 1 27 -5 35
-16 19 -59 19 -66 1z" className="svg-elem-6 animate-hover"></path>
{/* <path d="M1586 4497 c-13 -9 -17 -23 -14 -52 2 -32 8 -42 30 -53 65 -31 113
51 62 103 -19 18 -54 19 -78 2z" className="svg-elem-7 animate-hover"></path> */}
<path d="M3220 4490 c-32 -32 -22 -82 20 -100 65 -27 124 65 68 104 -31 22
-64 20 -88 -4z" className="svg-elem-8 animate-hover"></path>
<path d="M3626 4094 c-34 -33 -10 -104 35 -104 25 0 59 35 59 60 0 25 -34 60
-59 60 -11 0 -27 -7 -35 -16z" className="svg-elem-9 animate-hover"></path>
<path d="M1191 4086 c-19 -23 -9 -67 21 -89 25 -19 28 -19 52 -3 28 18 34 53
16 87 -13 23 -71 26 -89 5z" className="svg-elem-10 animate-hover"></path>
<path d="M866 3289 c-20 -15 -26 -29 -26 -57 0 -61 20 -112 59 -154 31 -34 44
-40 84 -43 44 -3 50 -6 66 -38 51 -100 240 -309 308 -340 30 -13 29 -18 -13
-44 -28 -18 -40 -21 -55 -12 -11 5 -42 10 -69 11 -57 0 -101 -26 -127 -75 -21
-41 -21 -113 0 -134 24 -24 113 -29 152 -9 35 19 75 81 75 115 0 26 48 57 102
66 33 6 50 0 126 -40 120 -66 188 -114 248 -177 62 -65 128 -147 123 -152 -2
-3 -40 1 -84 7 -67 10 -88 18 -123 45 -33 26 -42 40 -42 64 0 43 -37 98 -76
114 -50 21 -111 18 -124 -5 -15 -30 -12 -68 10 -112 26 -50 72 -79 126 -79 27
0 47 -6 58 -19 15 -17 15 -19 1 -25 -9 -3 -43 -6 -76 -6 -50 0 -66 5 -100 30
-23 16 -56 32 -73 36 -67 12 -166 -55 -166 -113 0 -56 75 -123 138 -123 38 0
86 25 118 62 28 32 37 36 125 48 99 13 280 15 338 2 l34 -7 -36 -28 c-26 -20
-43 -26 -61 -21 -43 11 -96 -32 -125 -103 -35 -86 42 -145 125 -94 34 21 74
92 74 133 0 20 10 30 44 48 39 21 46 22 76 10 50 -21 172 -147 207 -215 51
-98 65 -170 61 -319 -3 -120 -5 -136 -32 -195 -24 -50 -44 -76 -100 -123 -39
-32 -100 -74 -136 -91 l-65 -32 -560 -6 c-308 -3 -561 -6 -562 -7 -11 -8 0
-61 13 -66 9 -3 112 -6 230 -6 209 0 214 -1 204 -19 -5 -11 -29 -30 -52 -43
-51 -28 -63 -63 -26 -77 30 -11 67 -5 97 18 18 14 25 31 29 70 l5 51 208 0
c115 0 209 -2 209 -4 0 -6 -130 -90 -195 -126 -33 -19 -93 -55 -132 -82 -74
-50 -88 -73 -58 -98 13 -11 25 -6 73 27 31 22 100 64 152 93 130 73 203 123
237 163 26 33 32 35 105 39 43 3 86 11 96 19 11 8 48 36 82 63 54 42 61 46 55
25 -11 -35 -91 -130 -161 -189 -16 -14 -90 -71 -164 -127 -185 -138 -232 -181
-228 -207 5 -33 60 -35 77 -3 7 13 52 53 99 88 48 35 89 66 92 69 3 4 43 35
90 70 138 105 218 194 249 280 23 63 106 229 114 230 5 0 7 -76 4 -169 l-4
-168 -46 -59 c-25 -32 -121 -133 -212 -223 -140 -138 -166 -168 -163 -190 5
-40 41 -40 69 1 12 18 99 108 192 201 l169 167 -3 -87 -4 -88 -49 -45 c-26
-25 -61 -53 -77 -63 -34 -22 -39 -61 -10 -77 29 -15 29 -15 82 42 l49 53 0
-96 c0 -102 9 -124 47 -117 16 3 19 18 23 113 l5 110 40 -52 c42 -56 76 -73
100 -53 25 21 17 47 -27 82 -23 18 -59 49 -80 68 l-38 34 0 95 0 95 24 -33
c13 -17 86 -96 162 -174 76 -78 151 -161 167 -184 15 -24 34 -43 41 -43 18 0
36 21 36 42 0 22 -109 148 -249 288 -57 58 -122 127 -143 153 l-38 49 1 191
c1 106 4 181 6 167 2 -14 24 -65 47 -115 24 -49 47 -101 51 -115 36 -117 166
-247 458 -456 43 -31 85 -67 94 -80 10 -16 25 -24 44 -24 25 0 29 4 29 27 0
29 -21 49 -184 175 -220 170 -257 201 -299 251 -40 47 -67 88 -67 101 0 3 45
-21 101 -54 79 -46 113 -60 159 -65 47 -5 63 -13 86 -37 35 -36 113 -90 225
-156 46 -27 115 -68 153 -92 75 -45 101 -46 101 0 0 18 -23 37 -120 96 -66 40
-144 86 -174 101 -29 15 -69 42 -88 58 l-35 30 459 0 458 0 0 30 0 30 -102 3
c-94 2 -120 10 -93 27 22 14 13 45 -94 330 -19 50 -42 112 -52 139 -24 67 -46
75 -127 47 -83 -28 -87 -27 -87 13 0 26 -7 40 -27 56 -24 19 -38 21 -100 18
-92 -4 -113 -21 -114 -92 0 -43 -2 -47 -11 -30 -15 32 -51 44 -126 44 -51 0
-73 -5 -92 -20 l-25 -19 4 -250 c4 -289 13 -267 -100 -231 -91 28 -188 96
-231 162 -109 168 -103 483 15 656 32 48 150 150 183 158 13 3 43 -5 73 -20
47 -24 51 -29 51 -62 0 -101 87 -168 174 -134 51 19 46 108 -10 170 -28 31
-45 40 -82 46 -49 6 -92 27 -92 44 0 14 230 13 348 -2 94 -11 97 -13 136 -54
68 -71 163 -69 227 3 39 45 37 74 -7 123 -61 68 -159 75 -216 15 -20 -21 -32
-25 -83 -24 -33 0 -68 4 -79 8 -17 7 -16 8 7 24 15 9 38 17 52 17 77 0 153
112 125 184 -8 23 -15 26 -60 26 -45 0 -54 -4 -95 -43 -36 -35 -45 -50 -45
-78 0 -26 -8 -41 -40 -70 -38 -35 -44 -37 -125 -41 -47 -2 -85 -2 -85 0 0 3
39 47 87 99 91 99 178 165 302 227 80 41 107 42 177 9 25 -12 34 -23 34 -41 0
-35 37 -96 70 -115 33 -20 105 -22 140 -4 37 18 47 67 26 122 -31 79 -121 124
-184 92 -27 -13 -32 -12 -67 9 l-37 22 24 14 c41 22 230 228 281 306 40 61 52
72 76 72 36 0 89 36 118 79 18 27 23 48 23 102 0 59 -3 70 -22 83 -33 24 -88
20 -129 -8 -49 -34 -73 -86 -74 -166 -1 -60 -5 -70 -46 -130 -52 -76 -215
-244 -279 -287 -25 -17 -68 -43 -95 -58 -230 -127 -311 -191 -455 -359 -47
-56 -85 -90 -117 -106 -75 -38 -134 -79 -191 -134 -73 -70 -107 -120 -137
-207 l-26 -74 6 64 c14 141 101 298 221 396 28 23 92 59 140 79 49 21 95 43
102 48 16 14 15 47 -2 54 -16 6 -156 -46 -219 -81 -82 -46 -204 -186 -234
-268 -5 -13 -10 40 -13 133 -3 89 -1 167 5 183 8 22 6 31 -12 48 -39 40 -91
-8 -64 -59 7 -13 11 -84 11 -179 l-1 -158 -36 70 c-56 105 -156 202 -263 253
-113 54 -145 60 -160 32 -15 -28 -10 -32 69 -64 92 -37 153 -79 220 -152 67
-74 111 -157 140 -266 23 -84 27 -131 9 -88 -63 148 -128 232 -237 304 -38 25
-72 46 -75 46 -20 0 -89 58 -132 111 -27 33 -66 79 -87 102 -21 23 -45 52 -54
64 -17 25 -137 107 -263 178 -121 68 -214 141 -306 238 -105 111 -164 210
-164 275 0 131 -129 228 -214 161z m93 -54 c29 -15 51 -58 51 -101 0 -18 -5
-24 -22 -24 -36 1 -58 24 -74 75 -20 67 -9 78 45 50z m3031 -36 c0 -31 -6 -47
-29 -70 -34 -34 -56 -37 -71 -9 -21 39 34 120 82 120 14 0 18 -8 18 -41z
m-2737 -687 c-2 -57 -36 -76 -97 -52 -33 12 -32 21 0 60 22 26 33 31 63 28 34
-3 36 -5 34 -36z m2482 13 c40 -39 29 -75 -22 -75 -21 0 -73 58 -73 81 0 30
64 26 95 -6z m-2157 -155 c35 -22 45 -60 15 -60 -23 0 -35 9 -56 40 -31 45
-14 53 41 20z m1792 -2 c0 -6 -10 -22 -22 -35 -37 -40 -79 -23 -45 19 20 26
67 37 67 16z m-1921 -207 c24 -18 24 -20 8 -45 -26 -38 -78 -33 -130 12 -17
15 -17 17 5 34 30 23 87 22 117 -1z m2116 3 c31 -20 31 -29 3 -48 -46 -29 -73
-29 -107 0 l-33 27 24 18 c29 23 81 24 113 3z m-521 -165 c28 -22 36 -69 11
-69 -21 0 -55 41 -55 67 0 28 10 29 44 2z m-1134 -2 c0 -25 -31 -57 -56 -57
-31 0 -31 14 1 45 26 27 55 33 55 12z m1460 -397 c0 -40 0 -40 -39 -40 -59 0
-71 8 -71 46 l0 34 55 0 55 0 0 -40z m-255 -49 c3 -11 3 -31 -1 -45 -6 -24
-10 -26 -60 -26 l-54 0 0 45 0 45 54 0 c45 0 56 -3 61 -19z m473 -10 c10 -29
9 -30 -35 -47 -44 -17 -46 -17 -59 1 -23 31 -16 43 34 58 26 8 48 15 49 16 0
1 6 -12 11 -28z m-396 -224 c2 -125 0 -227 -4 -227 -5 0 -8 104 -8 232 0 127
2 229 4 227 3 -2 6 -107 8 -232z m162 177 c13 -5 16 -26 16 -126 l0 -119 -52
3 -53 3 -3 117 c-3 114 -2 117 20 121 38 7 55 7 72 1z m96 -67 c0 -11 81 -225
115 -304 13 -29 12 -31 -8 -37 -12 -3 -46 -6 -74 -6 l-53 0 0 186 c0 121 3
183 10 179 6 -3 10 -12 10 -18z m203 -66 c15 -43 27 -81 27 -84 0 -9 -79 -29
-89 -22 -8 5 -30 59 -51 128 -8 25 -6 29 23 41 56 25 61 22 90 -63z m-538 -31
l0 -75 -57 -3 -58 -3 0 74 c0 40 3 77 7 81 4 4 30 6 58 4 l50 -3 0 -75z m605
-155 c5 -27 2 -31 -33 -43 -35 -12 -40 -12 -53 5 -21 28 -17 43 19 58 44 20
61 15 67 -20z m-369 5 c5 0 9 -18 9 -40 l0 -40 -44 0 c-46 0 -56 10 -56 55 0
18 6 25 28 28 15 2 33 2 40 0 8 -1 18 -3 23 -3z m-241 -34 c0 -36 -12 -46 -59
-46 -35 0 -51 17 -51 52 0 27 1 28 55 28 l55 0 0 -34z" className="svg-elem-11"></path>
{/* <path d="M3928 2884 c-13 -27 -5 -49 24 -68 28 -17 68 8 68 43 0 53 -71 72
-92 25z" className="svg-elem-12"></path> */}
<path d="M882 2888 c-15 -15 -15 -51 0 -66 7 -7 27 -12 45 -12 41 0 62 34 44
69 -13 24 -68 30 -89 9z" className="svg-elem-13"></path>
<path d="M980 2750 c-37 -37 -2 -70 73 -70 29 0 49 6 58 16 11 14 9 20 -19 45
-38 34 -83 38 -112 9z" className="svg-elem-14"></path>
<path d="M3830 2752 c-26 -13 -35 -23 -35 -42 0 -22 5 -25 41 -28 59 -4 94 12
94 43 0 18 -7 28 -26 35 -33 13 -33 13 -74 -8z" className="svg-elem-15"></path>
<path d="M2257 2402 c-30 -33 -15 -72 28 -72 44 0 63 60 26 80 -27 14 -35 13
-54 -8z" className="svg-elem-16"></path>
<path d="M2583 2413 c-7 -2 -13 -20 -13 -39 0 -28 4 -35 25 -40 31 -8 55 10
55 40 0 37 -30 55 -67 39z" className="svg-elem-17"></path>
<path d="M1596 2004 c-32 -31 -7 -94 37 -94 21 0 57 35 57 55 0 21 -36 55 -59
55 -11 0 -27 -7 -35 -16z" className="svg-elem-18"></path>
<path d="M3253 2008 c-34 -16 -32 -74 2 -90 19 -9 29 -8 50 6 30 20 32 49 5
76 -23 23 -26 23 -57 8z" className="svg-elem-19"></path>
<path d="M3500 981 c-32 -61 17 -111 110 -111 38 0 52 4 57 16 10 26 -10 48
-53 57 -21 4 -50 19 -64 32 -31 30 -36 31 -50 6z" className="svg-elem-20"></path>
</g>
</svg>

    </div>
  );
}