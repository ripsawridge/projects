#!/bin/sh
awk '
BEGIN {
  site_attributes[""] = 0
  site_history[""] = 0
}
{
  if (/^\[.+ in ~/) {
    type = substr($1, 2)
    location = $3
    if ($5 == "native") {
      state = $7
      source = $6
    } else {
      state = $6
      source = $5
    }
    if (site_attributes[location] == "") {
      site_attributes[location] = type " " source
    }
    if (site_history[location] == "") {
      site_history[location] = state
    } else {
      site_history[location] = site_history[location] " " state
    }
    # print NF, location, state
  }
} 
END {
  # Canonicalize the site name, reducing foo+256, foo+17 to foo+2, foo+1.
  function_to_site[""] = 0
  for (i in site_attributes) {
    split(i, split_output, "+")
    function_to_site[split_output[1]] = function_to_site[split_output[1]] " " split_output[2]
  }

  site_to_canon[""] = 0
  for (i in function_to_site) {
    split(function_to_site[i], split_output, " ")
    len = asort(split_output, sort_output)
    for (j = 1; j <= len; j++) {
      site_to_canon[i "+" sort_output[j]] = i "+" j
    }
  }

  # print the site attributes and history
  for (i in site_attributes) {
    if (i != "") {
      print site_to_canon[i], site_attributes[i], site_history[i]
    }
  }
} ' | sort -k 3