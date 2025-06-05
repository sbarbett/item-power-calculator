# item-power-calculator

A containerized, web-based tool for calculating the power level of items in Acropolis. This calculator helps builders design balanced items and allows players to evaluate their loot's relative power.

## Purpose

The calculator provides a standardized way to measure and compare the power level of items in Acropolis. It uses a formula that takes into account various item attributes, including:

- Basic stats (HR, DR, saves)
- Attributes (STR, DEX, CON, INT, WIS, CHA)
- Resource bonuses (HP, MANA, MOVE)
- Resistances
- Spell effects and casts
- Meta-stats (crit chance, penetration, etc.)
- Weapon-specific attributes (damage dice, special types)
- Armor-specific attributes (AC values)

## Power Score Formula

### Common Terms

- **HR, DR**: Hit Roll and Damage Roll (positive integers)
- **saves**: A single "Saves" value
  - Negative saves (e.g. -15) are beneficial and add |saves| to PS
  - Positive saves are detrimental and subtract from PS
- **Attributes**: STR, DEX, CON, INT, WIS, CHA (+2 PS per point)
- **Resources**: HP, MANA, MOVE (+0.1 PS per point)
- **Specific Resistances**: Each resistance (fire, cold, etc.) = +10 PS
- **Spellaffects**: +15 PS each
- **Spellcasts**: +20 PS each

### Meta-stats (Raw Values)

Meta-stats are entered as raw values and converted to percentages (raw/100) before being weighted:

```
Crit Chance:   raw/100 × 10 PS per 1%
Crit Damage:   raw/100 × 8 PS per 1%
Penetration:   raw/100 × 5 PS per 1%
Recuperation:  raw/100 × 2 PS per 1%
Concentration: raw/100 × 2 PS per 1%
Endurance:     raw/100 × 2 PS per 1%
Prosperity:    raw/100 × 1 PS per 1%
```

### Weapon Power Score (PS_W)

```
PS_W = 
    HR
  + DR
  + saves (negative adds |saves|, positive subtracts |saves|)
  + 2 × (STR + DEX + CON + INT + WIS + CHA)
  + 0.1 × (HP + MANA + MOVE)
  + 10 × (count of specific resistances)
  + 15 × (number of spellaffects)
  + 20 × (number of spellcasts)
  + 0.5 × AvgDamage
  + Σ(Special Types PS)
  + Meta-stats contributions
```

Where:
- **AvgDamage** = X × (Y + 1)/2 for "Damage is X d Y"
- **Special Types PS**:
  - Flaming: +10 PS
  - Frost: +10 PS
  - Shocking: +10 PS
  - Acid: +10 PS
  - Vampiric: +15 PS
  - Vorpal: +10 PS
  - Purify: +10 PS
  - Sharp: +10 PS
  - Twohands: -20 PS (requires both hands)
  - Poison: +10 PS

### Armor Power Score (PS_A)

```
PS_A = 
    HR
  + DR
  + saves (negative adds |saves|, positive subtracts |saves|)
  + (AC_pierce + AC_bash + AC_slash + AC_exotic)
  + 2 × (STR + DEX + CON + INT + WIS + CHA)
  + 0.1 × (HP + MANA + MOVE)
  + 10 × (count of specific resistances)
  + 15 × (number of spellaffects)
  + 20 × (number of spellcasts)
  + Meta-stats contributions
```

## Example Calculation

### Bloodstone Axe of Power
```
Damage: 16d15
  → AvgDamage = 16 × (15+1)/2 = 128
  → WeaponDmgPS = 0.5 × 128 = 64

Special Types:
  - Flaming (+10)
  - Vampiric (+15)
  - Acid (+10)
  - Shocking (+10)
  Total: 45 PS

Stats:
  - HR: +13
  - DR: +13
  - HP: +100 (10 PS)
  - Spellcast(cause_critical): +20 PS
  - Saves: 0 (no impact)

Final PS_W = 13 + 13 + 0 + 0 + 10 + 0 + 0 + 20 + 64 + 45 = 165
```

## Usage

1. Select item type (Weapon or Armor)
2. Enter all relevant stats and attributes
3. For weapons, specify damage dice and special types
4. For armor, enter AC values
5. Add any resistances, spell effects, or meta-stats
6. The calculator will automatically compute the final Power Score

## Quest Items

All values are rounded to two decimals.

| Item Name                      | Type   | Power Score | Notes (key contributors)                                                                                                                                                                           |
| :----------------------------- | :----- | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nine Inch Nail**             | Weapon |    210.00   | HR 0, DR 15; HP +500→50 PS, Mana +500→50 PS; AvgDmg (15d15 → 120 × 0.5 = 60); Special \[frost (+10), vampiric (+15), sharp (+10), poison (+10)] = +35 PS.                                          |
| **Bloodstone Axe of Power**    | Weapon |    165.00   | HR +13, DR +13; HP +100→10 PS; Spellcast(cause\_critical) = +20 PS; AvgDmg (16d15 → 128 × 0.5 = 64); Special \[flaming (+10), vampiric (+15), acid (+10), shocking (+10)] = +45 PS.                |
| **Mace of Destruction**        | Weapon |    164.25   | HR +4, DR +16; STR +4 → 8 PS; HP +100→10 PS; Spellcast(faerie\_fire) = +20 PS; AvgDmg (19d14 → 133 × 0.5 = 66.5); Special \[vampiric (+15), acid (+10), poison (+10)] = +35 PS.                    |
| **Crystal Staff of the Magi**  | Weapon |    143.00   | HR +10, DR +5; HP −100 → −10 PS, Mana +500→50 PS; AvgDmg (16d16 → 136 × 0.5 = 68); Special \[flaming (+10), frost (+10), acid (+10), shocking (+10)] = +40 PS.                                     |
| **The Bow of Accuracy**        | Weapon |    166.25   | HR +40; Move +300→30 PS; Spellaffect(infrared) = +15 PS; AvgDmg (15d18 → 142.5 × 0.5 = 71.25); Special \[flaming (+10), frost (+10), purify (+10), twohands (−20)] = +10 PS.                       |
| **Bloodstone Dagger**          | Weapon |    153.00   | HR +12, DR +12; Spellcast(harm) = +20 PS; AvgDmg (16d15 → 128 × 0.5 = 64); Special \[flaming (+10), vampiric (+15), sharp (+10), poison (+10)] = +45 PS.                                           |
| **Crystal Bow**                | Weapon |    173.00   | HR +15, DR +15; HP +100→10 PS, Mana +150→15 PS; Spellcast(magic\_missile) = +20 PS; AvgDmg (17d15 → 136 × 0.5 = 68); Special \[flaming (+10), frost (+10), shocking (+10)] = +30 PS.               |
| **Shining Silver Dagger**      | Weapon |    158.75   | HR +15, DR +15; Mana −100 → −10 PS; Spellaffect(talon) = +15 PS; AvgDmg (25d10 → 137.5 × 0.5 = 68.75); Special \[flaming (+10), vampiric (+15), vorpal (+10), purify (+10), sharp (+10)] = +55 PS. |
| **Bloodstone Axe of Power**    | Weapon |    165.00   | (duplicate of above—same PS 165.00)                                                                                                                                                                |
| **Diamond Hilted Sword**       | Weapon |    126.25   | HR +10, DR +10; HP +150→15 PS; Spellcast(cure\_serious) = +20 PS; AvgDmg (19d14 → 142.5 × 0.5 = 71.25).                                                                                            |
| **Whip of Pain**               | Weapon |    136.00   | HR +18, DR +16; HP +100→10 PS, Mana +100→10 PS; AvgDmg (18d15 → 144 × 0.5 = 72); Special \[vorpal (+10), purify (+10), sharp (+10), twohands (−20)] = +10 PS.                                      |
| **Diamond Headed Spear**       | Weapon |    121.25   | HR 0, DR 0; Mana +200→20 PS; Spellcast(cure\_critical) = +20 PS; AvgDmg (19d14 → 142.5 × 0.5 = 71.25); Special \[vorpal (+10), purify (+10), twohands (−20), sharp (+10)] = +10 PS.                |
| **Diamond Staff of the Magi**  | Weapon |    143.00   | (duplicate of Crystal Staff — already listed at PS 143.00)                                                                                                                                         |
| **Mace of Destruction**        | Weapon |    164.25   | (duplicate of above—PS 164.25)                                                                                                                                                                     |
| **Bloodstone Ring of Power**   | Armor  |    152.00   | HR +20, DR +20; INT +3→6 PS, CON +3→6 PS; Mana +200→20 PS; AC (20+20+20+20 = 80).                                                                                                                  |
| **Shield of Purity**           | Armor  |    159.00   | HR +8, DR +8; CON +3→6 PS, INT +3→6 PS, WIS +3→6 PS; HP +100→10 PS, Mana +200→20 PS; Spellaffect(pass\_door) = +15 PS; AC (20+20+20+20 = 80).                                                      |
| **Quiver of Enchanted Arrows** | Armor  |    70.00    | HR +10, DR +10; DEX +5→10 PS; HP +100→10 PS; Saves +10→10 PS; Spellcast(slow) = +20 PS.                                                                                                            |
| **Bloodstone Medallion**       | Armor  |    138.00   | HR +5, DR +15; CON +4→8 PS; HP +150→15 PS; Spellaffect(fireshield) = +15 PS; AC (20+20+20+20 = 80).                                                                                                |
| **Diamond Amulet**             | Armor  |    147.00   | HR +7, DR +7; INT +4→8 PS; HP +100→10 PS, Mana +200→20 PS; Spellaffect(planeshift) = +15 PS; AC (20+20+20+20 = 80).                                                                                |
| **Diamond Ring of Might**      | Armor  |    137.00   | HR +15, DR +15; STR +3→6 PS, WIS +3→6 PS; HP +150→15 PS; AC (20+20+20+20 = 80).                                                                                                                    |
| **Veil of Tranquility**        | Armor  |    131.00   | HR +2, DR +2; Saves (−5→+5, −2→+2 → sum = +7 PS); Mana +250→25 PS; AC (25+25+25+20 = 95).                                                                                                          |
| **Adamantium Tongue Barbell**  | Armor  |    175.00   | HR +20, DR +20; CON +5→10 PS; HP +400→40 PS; Resistances (wood, silver, iron) = +3×10 = +30 PS; Spellaffect(sanctuary) = +15 PS; AC +40.                                                           |
| **Soulstone Nose Ring**        | Armor  |    120.00   | HR +20, DR +10; WIS +5→10 PS; Saves (−15→+15 PS); Mana +400→40 PS; Resist(mental) = +10 PS; Spellaffect(spiritlink) = +15 PS.                                                                      |
| **Mithril Navel Chain**        | Armor  |    118.00   | HR +16, DR +12; DEX +5→10 PS; HP +150→15 PS, Mana +250→25 PS; Spellaffect(chaste) = +15 PS; AC +25.                                                                                                |
| **Obsidian Ear Cuff**          | Armor  |    93.00    | HR +13, DR +15; INT +5→10 PS; HP +200→20 PS; Move +100→10 PS; Spellaffect(dark\_vision) = +15 PS; AC +0.                                                                                           |
| **Flaming Skull**              | Armor  |    106.00   | HR +20, DR +20; STR +3→6 PS; HP +250→25 PS; Move +100→10 PS; Special(flaming) = +10 PS\*\*\*; Saves (−10→+10 PS); AC +15.                                                                          |
| **Diamond Lantern**            | Armor  |    116.00   | HR +15, DR +15; WIS +3→6 PS; HP +200→20 PS; Mana +100→10 PS; Spellaffect(flying) = +15 PS; Saves (−15→+15 PS); AC +20.                                                                             |
| **King Masterwork Shoes**      | Armor  |    96.00    | HR +5, DR +6; Move +300→30 PS; AC (15+15+15+10 = 55).                                                                                                                                              |
| **Guiding Hand of a God**      | Armor  |    60.00    | STR +6→12 PS, DEX +6→12 PS, CON +6→12 PS, INT +6→12 PS, WIS +6→12 PS (five stats × 2 PS each = 60 PS).                                                                                             |
| **Cloak of Prosperity**        | Armor  |    94.00    | HR +2, DR +2; HP +250→25 PS; AC (20+20+20+5 = 65).                                                                                                                                                 |
| **Lucky Silver Bracelet**      | Armor  |    15.00    | AC +5; STR/DEX/INT/WIS/CON +1 each → 5 stats×2 = 10 PS total; no other effects.  

The "nine inch nail" is an anomaly due to its high hp and mana stats.

* **Weapons** (excluding Nine Inch Nail)

  * Average PS ≈ 150.68
  * Median PS = 155.88
  * Highest PS = 173.00 (Crystal Bow)

* **Armor**

  * Average PS ≈ 113.35
  * Median PS = 118.00
  * Highest PS = 175.00 (Adamantium Tongue Barbell)
