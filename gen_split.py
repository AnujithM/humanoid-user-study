import random

random.seed(42)

TEXTS = {
    '115': 'person raises left arm to shoulder height and then lowers it back down by side',
    '156': 'person stands still and lifts right hand to face and mouth area',
    '312': 'a person uses their left hand to scratch their right wrist.',
    '333': 'a person jumped on the place',
    '409': 'a person waves his hand enthusiastically',
    '456': 'a person turns to the left and steps forward, then kicks with their right foot.',
    '504': 'a man kicks with his right leg and then kicks with his left leg.',
    '520': 'a person kicks with their left leg.',
    '554': 'a person, while standing in still, starts to fold arms, pauses shortly and releases them.',
    '556': 'a person jumps and spin in the air.',
    '568': 'the person does a couple of small kicks with his left leg',
    '605': 'person walks whilst grabbing onto a banister to help their balance.',
    '765': 'a person steps forward and turns left, then shuffles around awkwardly.',
    '891': 'the person moves backwards as if pushed by someone in front of them.',
    '981': 'a person who is standing with his hands by his sides steps forward with his right foot, kicks out with his left foot and then steps back to his original position.',
    '1025': 'a person doing jumping jacks in a single spot.',
    '1048': 'a person walks forward, then holds their right arm in pain.',
    '1076': 'the man kicks with his right foot.',
    '1104': 'the sim appears to be adjusting a watch that is placed on their left wrist.',
    '1181': 'the person is standing there.',
    '1197': 'someone is running in place and then stops.',
    '1272': 'a person stumbles forward while maintaining his balance.',
    '1381': 'he is flying kick with his right leg',
    '1433': 'the man raises his left hand over his chest, waves out and back in toward his body, then releases it back down toward his hip.',
    '1510': 'this person does jumping jacks then kicks with his right leg.',
    '1604': 'a person walks forward.',
    '1654': 'a figure gestures with arms outstretched to the left and then twists with arms still extended',
    '1708': 'the man plays the violin.',
    '1836': 'a person looks to the right then turns left to take a look left.',
    '1840': 'the stick figure is walking in form of a back wards letter j.',
    '1850': 'a person walks diagonally forward, stops abruptly, grabs his head with his right hand, walks backward briefly, and then turn to the right and walks straight.',
    '1904': 'a person waves, takes a step back, turns clockwise and waves again',
    '1998': 'a man walks slowly forwards.',
    '2036': 'person is carefully scratching their head or ear.',
    '2052': 'a person tapping on a surface',
    '2150': 'a person has something in their right hand, and brings it to their face.',
    '2321': 'a person reaches for something with both hands, the raises their right hand then sets its hands back down.',
    '2346': 'the person puts something on its side and then brings it back to normal.',
    '2358': 'the person is doing knee lifts.',
    '2372': 'a person picks up two objects, pours something from the right object into the left object, and then sets them back down.',
}

IDS = list(TEXTS.keys())  # 40 IDs (281 removed)
random.shuffle(IDS)

# Split IDs into two groups of 20
group1_ids = IDS[:20]   # These 20 IDs go to Form 1
group2_ids = IDS[20:]   # These 20 IDs go to Form 2

# Each form: every ID appears TWICE (once vs OmniControl, once vs MaskedMimic)
# = 20 IDs × 2 comparisons = 40 comparisons per form

# Form 1: 20 IDs, each compared against both baselines
form1_items = []
for mid in group1_ids:
    dpo_first_omni = random.random() < 0.5
    form1_items.append({'id': mid, 'text': TEXTS[mid], 'type': 'omni', 'dpoFirst': dpo_first_omni})
    dpo_first_mm = random.random() < 0.5
    form1_items.append({'id': mid, 'text': TEXTS[mid], 'type': 'mm', 'dpoFirst': dpo_first_mm})
random.shuffle(form1_items)

# Form 2: other 20 IDs, each compared against both baselines
form2_items = []
for mid in group2_ids:
    dpo_first_omni = random.random() < 0.5
    form2_items.append({'id': mid, 'text': TEXTS[mid], 'type': 'omni', 'dpoFirst': dpo_first_omni})
    dpo_first_mm = random.random() < 0.5
    form2_items.append({'id': mid, 'text': TEXTS[mid], 'type': 'mm', 'dpoFirst': dpo_first_mm})
random.shuffle(form2_items)

def to_js(arr):
    lines = []
    for item in arr:
        t = item['type']
        d = 'true' if item['dpoFirst'] else 'false'
        escaped = item['text'].replace("'", "\\'")
        lines.append(f"      {{ id: '{item['id']}', text: '{escaped}', type: '{t}', dpoFirst: {d} }}")
    return ',\n'.join(lines)

print('===FORM1===')
print(to_js(form1_items))
print()
f1_omni = sum(1 for x in form1_items if x['type'] == 'omni')
f1_mm = sum(1 for x in form1_items if x['type'] == 'mm')
print(f'Form1: {f1_omni} omni + {f1_mm} mm = {len(form1_items)} total')
print()
print('===FORM2===')
print(to_js(form2_items))
print()
f2_omni = sum(1 for x in form2_items if x['type'] == 'omni')
f2_mm = sum(1 for x in form2_items if x['type'] == 'mm')
print(f'Form2: {f2_omni} omni + {f2_mm} mm = {len(form2_items)} total')
