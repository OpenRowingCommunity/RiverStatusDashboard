name: New Club Onboarding Request
about: Request to add a new rowing club's safety matrix to the system.
title: "[NEW CLUB] <Club Full Name>"
labels: new club, config request
assignees: your-github-username # Replace with your GitHub username or team if applicable

body:
  - type: markdown
    attributes:
      value: |
        Thanks for your interest in adding your club to our safety monitoring system! Please fill out the following details as completely as possible. This information will be used to configure your club's specific safety rules.

  - type: input
    id: club-full-name
    attributes:
      label: Club Full Name
      description: The full, official name of your rowing club (e.g., "Rochester Institute of Technology Rowing Club").
      placeholder: Your Club's Full Name
    validations:
      required: true

  - type: input
    id: club-acronym
    attributes:
      label: Club Acronym/Short Name
      description: A short, common acronym or abbreviation for your club (e.g., "RIT", "UWash").
      placeholder: Club Acronym
    validations:
      required: true

  - type: input
    id: river-name
    attributes:
      label: River/Body of Water Name
      description: The name of the river, lake, or body of water your boathouse is on (e.g., "Genesee River", "Lake Washington").
      placeholder: River/Lake Name
    validations:
      required: true

  - type: input
    id: boathouse-latitude
    attributes:
      label: Boathouse Latitude
      description: The latitude coordinate of your boathouse. Please provide to 5-6 decimal places for accuracy (e.g., `43.064251`). You can often find this on Google Maps.
      placeholder: e.g., 43.064251
    validations:
      required: true

  - type: input
    id: boathouse-longitude
    attributes:
      label: Boathouse Longitude
      description: The longitude coordinate of your boathouse. Please provide to 5-6 decimal places for accuracy (e.g., `-77.699065`).
      placeholder: e.g., -77.699065
    validations:
      required: true

  - type: dropdown
    id: eval-strategy
    attributes:
      label: Safety Zone Evaluation Strategy
      description: How should the system determine the active safety zone when multiple conditions are met?
      options:
        - "Last Match (Most Restrictive): Checks from safest to least safe. The last zone found that matches the conditions is applied. (Recommended for typical 'most severe rule wins' policies)"
        - "First Match (Most Restrictive): Checks from least safe to safest. The first zone found that matches the conditions is applied. (Recommended for strict firewall-like policies)"
    validations:
      required: true

  - type: textarea
    id: data-sources
    attributes:
      label: Data Sources (Optional, but highly recommended)
      description: |
        Please list any specific weather/river data sources you currently use or would like to use. This helps us find the most accurate and relevant data for your location. If you don't know, we will try to find default sources.
        **Format:** Please list each source on a new line. Include:
        - Type of data (e.g., "Wind Speed", "Water Temperature", "River Flow")
        - Source (e.g., "NOAA weather station KROC", "USGS gauge 04230650")
        - Location/Comment (e.g., "Greater Rochester International Airport", "Jefferson Bridge")
        - Any relevant IDs or links if you know them.
      placeholder: |
        - Wind Speed: NOAA weather station KROC (Greater Rochester International Airport)
        - River Flow: USGS gauge 04230650 (Jefferson Bridge)
        - Water Level: NOAA water level sensor blbn6 (Jefferson Road Bridge)
        - Air Quality: AirNow (Eastern Lake Ontario Region NY)
        - ...
    validations:
      required: false

  - type: markdown
    attributes:
      value: |
        ## Safety Matrix Definition
        This is the most critical part. Please define your club's safety zones, conditions, and restrictions. We will convert this into the system's configuration.

  - type: textarea
    id: safety-zones
    attributes:
      label: Safety Zones
      description: |
        List each of your safety zones, from the SAFEST to the LEAST SAFE.
        For each zone, provide:
        -   **Label:** A short identifier (e.g., "1", "A", "G").
        -   **Color:** A color that represents this zone (e.g., "green", "yellow", "#FFA500").
        -   **Conditions:** The rules that trigger this zone.
            -   **Example:** "Wind Speed >= 5 knots AND < 10 knots"
            -   **Example:** "Lightning Risk >= 3"
            -   **Example:** "Water Temp < 45 F"
        -   **Restrictions:** A textual summary of limitations when in this zone.
            -   **Example:** "Novice crews must be accompanied by coach; no singles."

        Please use a clear, bulleted list or similar structure. Feel free to provide examples or existing documentation links if that helps convey your rules.
      placeholder: |
        - **Label: Green (G)**
          - **Color:** green
          - **Conditions:**
            - All conditions below thresholds
          - **Restrictions:**
            - No restrictions apply. Normal rowing.

        - **Label: Yellow (Y)**
          - **Color:** yellow
          - **Conditions:**
            - Wind Speed: At least 5 knots AND Less than 10 knots
          - **Restrictions:**
            - No novice crews under 4 people.
            - Coaches must be present on water.

        - **Label: Red (R)**
          - **Color:** orange / #FFA500
          - **Conditions:**
            - Wind Speed: At least 10 knots AND Less than 15 knots
            - OR Lightning Risk: At least 3 (on a 0-10 scale)
          - **Restrictions:**
            - Only experienced crews allowed.
            - All crews must stay within designated sheltered areas.

    validations:
      required: true

  - type: textarea
    id: unsafe-zone
    attributes:
      label: Unsafe Zone (Catastrophic Conditions)
      description: |
        Define the conditions that lead to your club's "unsafe" or "no rowing" state.
        -   **Label:** A short identifier (e.g., "U", "☠️").
        -   **Color:** Typically red or black.
        -   **Conditions:** (e.g., "Wind Speed >= 15 knots", "Lightning Risk >= 5", "Water Temp < 35 F")
        -   **Restrictions:** (e.g., "No rowing permitted under any circumstances.")
      placeholder: |
        - **Label: Unsafe (U)**
          - **Color:** red
          - **Conditions:**
            - Wind Speed: At least 15 knots
            - OR Lightning Risk: At least 5 (on a 0-10 scale)
          - **Restrictions:**
            - All rowing cancelled. No boats may leave the dock.

    validations:
      required: true

  - type: textarea
    id: additional-notes
    attributes:
      label: Any additional notes or context?
      description: Is there anything else you'd like us to know about your club's safety policies or specific requirements?
      placeholder: Additional comments...
    validations:
      required: false