################################################
  # Program:  IDH Farmfit Primary Data Collection
  # Function: Input generator for UI
  # Contact:  carmen@akvo.org
################################################

# ---- libraries ----

library(rmarkdown); library(dplyr); library(tidyr); library(tidylog); library(readr)
library(stringr); library(data.table) ;library(ggplot2); library(reshape2)
library(knitr); library(openxlsx); library(Hmisc)
library(here); library(zoo); library(readxl)
library(splitstackshape); library(sf); library(jsonlite)

#* R run script for IDH
#* @param survey_id as the id of survey
#* @get /idh/<survey_id>
function(survey_id) {
  # ---- functions ----

  # DATA TYPE Set factors to integers
  factor_to_int <- function(x){
    as.numeric(as.character(x))
  }

  # Find and replace outliers
  outlier_detection <- function(x){
    ifelse(
      x > (mean(x, na.rm=TRUE) + sd(x, na.rm=TRUE)*3) |
        x < (mean(x, na.rm=TRUE) - sd(x, na.rm=TRUE)*3), 
      9997,
      x
    )
  }

  # count values without NA
  count_n <- function(x){sum(!is.na(x))}

  # Select first word from string separated by a "|"
  first.word <- function(my.string){
    unlist(strsplit(my.string, "\\."))[1]
  }

  # ---- API link ----

  # Get input from Flow API:
  url <- "https://flow-data.tc.akvo.org/api/sources/idh/"
  endpoint <- paste(url, survey_id, sep='')
  print(endpoint)
  # flow_info <- jsonlite::fromJSON("https://flow-data.tc.akvo.org/api/sources/idh/84400281")
  flow_info <- jsonlite::fromJSON(endpoint)

  # ---- Endpoints ----

  # Company
  company_name <- flow_info$company

  # Crop
  sdm_crop <- tolower(flow_info$kind)

  # Country
  country <- flow_info$country

  # Company type:
  if(company_name == "Mwea Rice"){
    company_type = "Offtaker"
  }

  #else if(company_name == "")

  # ---- Survey ----

  # Link to survey
  survey_link <- flow_info$survey

  # Load survey info
  survey <- jsonlite::fromJSON(survey_link)

  survey_info <- data.frame()

  for(i in 1:length(survey$forms$questionGroups[[1]]$name)){

    df <- survey$forms$questionGroups[[1]]$questions[[i]]
    df['section'] <- str_trim(survey$forms$questionGroups[[1]]$name[[i]])
    df['section_id'] <- str_trim(survey$forms$questionGroups[[1]]$id[[i]])
    
    survey_info <- rbind(survey_info, df)
  }

  survey_info <- survey_info %>%
    select(section_id, section, name, id, everything())

  # ---- Load data ----

  # Data without RQG
  not_repeated_file <- flow_info$csv_no_repeatable

  # RQG
  repeated_file <- flow_info$csv_repeatable

  # Crop type
  crop_type <- ifelse(repeated_file != "character(0)", "annual", "perenial")

  # Read data
  data <- read.csv(not_repeated_file, stringsAsFactors = FALSE)

  colnames(data) <- sapply(colnames(data), first.word)
  colnames(data) <- gsub("X", "", colnames(data))
  colnames_data <- lapply(colnames(data), function(x){
    ifelse(grepl("[0-9]", x, perl = T), survey_info[survey_info$id == x, "variableName"],x)})
  colnames(data) <- colnames_data
  colnames(data)[duplicated(colnames(data))] <- make.unique(
    paste0(
      colnames(data)[duplicated(colnames(data))], "_other"))

  # For annual crop
  if(crop_type == "annual"){
    
    repeated_data <- read_csv(repeated_file)
    colnames(repeated_data) <- sapply(colnames(repeated_data), function(x) unlist(strsplit(x, "\\|"))[1])
    
    colnames_repeated_data <- lapply(colnames(repeated_data), function(x){
      ifelse(grepl("[0-9]", x, perl = T), survey_info[survey_info$id == x, "variableName"],x)})
    colnames(repeated_data) <- colnames_repeated_data
    colnames(repeated_data)[duplicated(colnames(repeated_data))] <- make.unique(
      paste0(
        colnames(repeated_data)[duplicated(colnames(repeated_data))], "_other"))
    
    # Get version for to make alternations
    raw_data <- data %>% left_join(repeated_data)
  }

  # Get original number of participants
  nr_participants_raw <- length(unique(data$Identifier))

  # SURVEY ADJUSTMENTS

  survey_questions <- survey_info %>% 
    # Trim trailing spaces
    mutate_if(is.character, str_trim) %>%
    # All variables to lowercase
    mutate_all(tolower) %>%
    mutate(variableName = gsub(paste("_", sdm_crop, sep=""), '', variableName)) %>%
    mutate(variableName = gsub("_1","", variableName))

  # DATA ADJUSTMENTS

  # Collect the different variables, numerical questions:
  numerical_columns <-survey_questions %>%
    filter(type == "number") %>%
    select("variableName") %>% pull()

  # Changes to data set:
  data <- data %>% 
    
    # Set the date to date format
    dplyr::rename(submission_date = Submission) %>%
    mutate(submission_date = as.Date(submission_date, format="%d-%m-%y")) %>% 
    
    # EGRANARY: Add the county based on submission date 
    # mutate(pi_location_cascade_county = ifelse(`Submission Date`< "2020-01-27", "Meru", "Trans Nzoia")) %>%
    
    # Remove irrelevant columns
    select(-c(Display, Device, Instance,
              Submitter, Form, Duration)) %>%
    select(-contains("--option--")) %>%
    
    # All column names to lowercase
    rename_all(funs(tolower)) %>%
    
    # All variables to lowercase
    mutate_all(tolower) %>%
    
    # EGRANARY
    # rename(ic_informed_consent = informed_consent) %>%
    
    # Remove to farmers that didn't participate
    filter(ic_informed_consent == "accepted to participate") %>%
    
    # trailing spaces
    mutate_if(is.character, str_trim) %>% 
    
    # Text changes
    mutate_all(funs(gsub("labour","labor",.))) %>% 
    rename_all(funs(gsub("_1","",.))) %>% 
    
    # Rename columns containing the crop type in the name -> changes when there are two crops!
    rename_at(vars(contains(sdm_crop)), funs(sub(paste("_", sdm_crop, sep=""), '', .))) %>%
    
    # farm size columns to numeric
    mutate_at(c("f_size", "f_sdm_size"), factor_to_int) %>%
    
    # Numerical columns to numeric data type
    # mutate_at(vars(numerical_columns), funs(as.numeric)) %>%
    
    # All variables that are 9999/"i don't know" or 9998/"i prefer not to say" are set to NA
    mutate_if(is.numeric, list(~na_if(., 9999))) %>%
    mutate_if(is.numeric, list(~na_if(., 9998))) %>%
    mutate_if(is.character, list(~na_if(., "i don't know"))) %>%
    mutate_if(is.character, list(~na_if(., "i prefer not to say"))) %>%
    
    # Set measurement of farm size to acres 
    mutate(f_size = ifelse(f_unit_land == "hectares", f_size*2.471, f_size)) %>%
    mutate(f_sdm_size = ifelse(f_unit_land == "hectares", f_sdm_size*2.471, f_sdm_size)) %>%
    
    # Rename the columns that changed values to indicate changes:
    dplyr::rename("f_size (acre)" = "f_size",
          "f_sdm_size (acre)" = "f_sdm_size")

  # Change columns data type remove missing and change different measurements to one
  if(crop_type == "annual"){
    repeated_data <- repeated_data %>%
      
      select(-c("Display Name", 
                "Device Identifier",
                "Instance", 
                "Submission Date", 
                "Submitter", 
                "Duration", 
                "Form Version")) %>%
      
      select(-contains("--option--")) %>%
      
      # All column names to lowercase
      rename_all(funs(tolower)) %>%
      
      # All variables to lowercase
      mutate_all(tolower) %>%
      
      # trailing spaces
      mutate_if(is.character, str_trim) %>% 
      
      # Text changes
      mutate_all(funs(gsub("labour","labor",.))) %>% 
      rename_all(funs(gsub("_1","",.))) %>% 
      
      # Rename columns containing the crop type in the name -> changes when there are two crops!
      rename_at(vars(contains(sdm_crop)), 
                funs(sub(paste("_", sdm_crop, sep=""), '', .))) %>%
      
      # From factor to numeric
      mutate_at(c("f_produced", "f_sold", 
                  "f_own_consumption", "f_lost"), factor_to_int) %>%
      
      # All variables that are 9999/"i don't know" or 9998/"i prefer not to say" are set to NA
      mutate_if(is.numeric, list(~na_if(., 9999))) %>%
      mutate_if(is.numeric, list(~na_if(., 9998))) %>%
      mutate_if(is.character, list(~na_if(., "i don't know"))) %>%
      mutate_if(is.character, list(~na_if(., "i prefer not to say"))) %>%
      
      # PRODUCED
      unite("f_produced_measurement", contains("f_produced_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_produced_measurement = parse_number(f_produced_measurement, na="NA")) %>%
      mutate(`f_produced (kilograms)` = f_produced*f_produced_measurement) %>%
      
      # SOLD
      unite("f_sold_measurement", contains("f_sold_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_sold_measurement = replace(f_sold_measurement, 
                                          f_sold_measurement == "i didn't sell anything this season", "0 kilograms")) %>%
      mutate(f_sold_measurement = parse_number(f_sold_measurement, na="NA")) %>%
      mutate(`f_sold (kilograms)` = f_sold*f_sold_measurement) %>%
      
      # LOST
      unite("f_lost_measurement", contains("f_lost_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_lost_measurement = replace(f_lost_measurement, f_lost_measurement == "i didn't lose any of the sdm crop", 0)) %>%
      mutate(f_lost_measurement = parse_number(f_lost_measurement, na="NA")) %>%
      mutate(`f_lost (kilograms)` = f_lost*f_lost_measurement) %>%
      
      # OWN CONSUMPTION
      unite("f_own_consumption_measurement", contains("f_own_consumption_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_own_consumption_measurement = replace(f_own_consumption_measurement, 
                                                    f_own_consumption_measurement == "i didn't use any for my own consumption", 0)) %>%
      mutate(f_own_consumption_measurement = parse_number(f_own_consumption_measurement, na="NA")) %>%
      mutate(`f_own_consumption (kilograms)` = f_own_consumption*f_own_consumption_measurement)
    
    ## ---- repeated groups ----

    repeated_data <- repeated_data %>% 
      group_by(identifier) %>%
      summarise(f_harvest_number = max(f_harvest_number, na.rm=TRUE),
                f_price = mean(f_price, na.rm=TRUE),
                `f_produced (kilograms)` = sum(`f_produced (kilograms)`, na.rm=TRUE),
                f_produced = sum(f_produced, na.rm=TRUE),
                f_produced_measurement = sum(f_produced_measurement, na.rm=TRUE),
                `f_sold (kilograms)` = sum(`f_sold (kilograms)`, na.rm=TRUE),
                f_sold = sum(f_sold, na.rm=TRUE),
                f_sold_measurement = sum(f_sold_measurement, na.rm=TRUE),
                `f_lost (kilograms)` = sum(`f_lost (kilograms)`, na.rm=TRUE),
                f_lost = sum(f_lost, na.rm=TRUE),
                f_lost_measurement = sum(f_lost_measurement, na.rm=TRUE),
                `f_own_consumption (kilograms)` = sum(`f_own_consumption (kilograms)`, na.rm=TRUE),
                f_own_consumption = sum(f_own_consumption, na.rm=TRUE),
                f_own_consumption_measurement = sum(f_own_consumption_measurement, na.rm=TRUE))
    
    data <- data %>% 
      left_join(repeated_data)
    
  }else{
    
    data <- data %>%
  
      # PRODUCED
      unite("f_produced_measurement", contains("f_produced_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_produced_measurement = parse_number(f_produced_measurement, na="NA")) %>%
      mutate(`f_produced (kilograms)` = f_produced*f_produced_measurement) %>%
      
      # SOLD
      unite("f_sold_measurement", contains("f_sold_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_sold_measurement = replace(f_sold_measurement, 
                                          f_sold_measurement == "i didn't sell anything this season", "0 kilograms")) %>%
      mutate(f_sold_measurement = parse_number(f_sold_measurement, na="NA")) %>%
      mutate(`f_sold (kilograms)` = f_sold*f_sold_measurement) %>%
      
      # LOST
      unite("f_lost_measurement", contains("f_lost_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_lost_measurement = replace(f_lost_measurement, f_lost_measurement == "i didn't lose any of the sdm crop", 0)) %>%
      mutate(f_lost_measurement = parse_number(f_lost_measurement, na="NA")) %>%
      mutate(`f_lost (kilograms)` = f_lost*f_lost_measurement) %>%
      
      # OWN CONSUMPTION
      unite("f_own_consumption_measurement", contains("f_own_consumption_measurement"), na.rm = TRUE, remove = FALSE, sep=" ") %>%
      mutate(f_own_consumption_measurement = replace(f_own_consumption_measurement, 
                                                    f_own_consumption_measurement == "i didn't use any for my own consumption", 0)) %>%
      mutate(f_own_consumption_measurement = parse_number(f_own_consumption_measurement, na="NA")) %>%
      mutate(`f_own_consumption (kilograms)` = f_own_consumption*f_own_consumption_measurement)
    
  }

  # remove lines without variable name
  survey_questions <- survey_questions %>%
    filter(!is.na(variableName))

  # Make same changes in survey question data
  for(kg in c("f_produced", "f_sold", "f_own_consumption", "f_lost")){
    survey_questions$variableName <- str_replace(
      survey_questions$variableName, paste0(kg, "\\b"), paste0(kg, ' (kilograms)')
    )
  }

  for(acre in c("f_size", "f_sdm_size")){
    survey_questions$variableName <- str_replace(
      survey_questions$variableName, paste0(acre, "\\b"), paste0(acre, ' (acre)')
    )
  }

  numerical_columns <- gsub(paste("_", tolower(sdm_crop), sep=""), "", numerical_columns)
  numerical_columns <- str_replace(
    numerical_columns, 
    c("f_size", "f_sdm_size", "f_produced", "f_sold", "f_own_consumption", "f_lost"), 
    c("f_size (acre)","f_sdm_size (acre)", "f_produced (kilograms)", 
      "f_sold (kilograms)", "f_own_consumption (kilograms)", 
      "f_lost (kilograms)"))

  # OUTLIER detection
  Data <- data %>%
    # Replace values that are more than 3 sd from the mean with 9997
    mutate_at(vars(numerical_columns), funs(outlier_detection))

  # Collect outliers for overview
  outliers <- data.frame(apply(Data, 2, function(x) sum(x == 9997, na.rm=TRUE)))
  outliers$Question <- rownames(outliers)
  names(outliers) <- c("outliers", "variableName")
  rownames(outliers) <- NULL
  outliers <- outliers %>% left_join(survey_questions, by="variableName") %>%
    select("section", "name", "variableName", "outliers") %>%
    arrange(desc(outliers))

  # Replace 9997 with NA after outliers are registered
  Data <- Data %>%
    mutate_if(is.numeric, list(~na_if(., 9997))) %>%
    # Remove farmer with too large farms
    filter(`f_size (acre)` < 10)

  # CROPS
  # Data <- Data %>% 
  #   
  #   # Rename for Egranary
  #   # rename(f_livestock = f_other_crop_livestock,
  #   #        hh_size_male = hh_male,
  #   #        hh_gender_farmer = hh_gender,
  #   #        hh_age_farmer = hh_age) %>%
  #   
  #   # Rename for Mwea
  #   rename(hh_size_male = hh_male) %>%
  #   
  #   # Farmer birth year to age
  #   mutate(hh_age_farmer = 2020 - hh_age_farmer) %>%
  #   
  #   # Farmer sample 
  #   mutate(farmer_sample = ifelse(!farmer_sample %in% c("yes", "no"), "no", farmer_sample)) %>%
  #   
  #   # First crop
  #   mutate(f_first_crop = ifelse(f_first_crop == "other", NA, f_first_crop)) %>%
  #   unite("f_first_crop", c(f_first_crop, f_first_crop_other),
  #         na.rm = TRUE, remove = TRUE, sep=" ") %>%
  #   
  #   # Second crop
  #   mutate(f_second_crop = ifelse(f_second_crop == "other", NA, f_second_crop)) %>%
  #   unite("f_second_crop", c(f_second_crop, f_second_crop_other),
  #         na.rm = TRUE, remove = TRUE, sep=" ") %>%
  #   mutate(f_second_crop = ifelse(f_second_crop == "",
  #                                 "i don't have a second main crop",
  #                                 f_second_crop)) %>%
  #   # Third crop
  #   unite("f_third_crop", c(f_third_crop, `f_third_crop_other`),
  #         na.rm = TRUE, remove = TRUE, sep=" ") %>%
  #   mutate(f_third_crop = ifelse(f_third_crop == "",
  #                                "i don't have a third main crop",
  #                                f_third_crop)) %>%
  #   # Combine crops with pipe
  #   mutate(f_crops = paste(f_first_crop, f_second_crop, f_third_crop, sep="|")) %>% 
  #   mutate(f_crops = gsub("\\|i don't have a second main crop|\\|i don't have a third main crop", "", f_crops))

  nr_participants_fsize <- length(unique(Data$identifier))

  ## Collect missing values for overview -> resulting from "I don't know" or "I prefer not to say" answers
  missing_9999 <- data.frame(
    apply(Data, 2, function(x) sum(x == "i don't know" | x == 9999, na.rm=TRUE)))
  missing_9999$Question <- rownames(missing_9999)
  names(missing_9999) <- c("i don't know", "variable")
  rownames(missing_9999) <- NULL

  missing_9998 <- data.frame(apply(Data, 2, function(x) sum(x == "i prefer not to say" | x == 9998, na.rm=TRUE)))
  missing_9998$Question <- rownames(missing_9998)
  names(missing_9998) <- c("i prefer not to say", "variable")
  rownames(missing_9998) <- NULL

  NA_values <- data.frame(apply(Data, 2, function(x) sum(is.na(x))))
  NA_values$Question <- rownames(NA_values)
  names(NA_values) <- c("missing due to skip logic", "variable")
  rownames(NA_values) <- NULL

  missings_raw <- missing_9999 %>% 
    left_join(missing_9998) %>%
    left_join(NA_values) %>%
    filter(!variable %like% "*option*") %>%
    filter(!variable %in% 
            c("identifier", "duration", 
              "sdm_farmer", "informed_consent")) 

  missings_raw <- missings_raw %>%
    filter(!is.na(variable)) %>%
    filter(!variable %like% "other") %>%
    rename(variableName = variable) %>%
    left_join(survey_questions, by="variableName") %>%
    select("section", "name", "variableName", 
          "missing due to skip logic", "i don't know", 
          "i prefer not to say")

  # REMOVE PRIVACY COLUMNS -> ALWAYS CHECK!

  ## MWEA: Somehow survey variable names do not 100% match with data 

  # Select variables with private information
  private_info <- survey_questions %>% 
    filter(section %like% "confidential") %>% 
    filter(!variableName %like% "cascade") %>%
    filter(!variableName %like% "geolocation") %>%
    pull(variableName)

  # Select Geolocation separate
  geolocation <- names(Data)[names(Data) %like% "geolocation"]
  cascade <- names(Data)[names(Data) %like% "cascade"]

  # Remove columns from set
  Data <- Data %>%
    select(-private_info, -all_of(geolocation), -all_of(cascade))

  ## ---- Numerical descriptives ----
  numerical_means <- Data %>%
    group_by(hh_gender_farmer) %>%
    select_if(is.numeric) %>%
    summarise_each(funs(round(mean(., na.rm = TRUE),2))) 

  numerical_sds <- Data %>% 
    group_by(hh_gender_farmer) %>%
    select_if(is.numeric) %>%
    summarise_each(funs(round(sd(., na.rm = TRUE),2))) 

  numerical_minus <- Data %>% 
    group_by(hh_gender_farmer) %>%
    select_if(is.numeric) %>%
    summarise_each(funs(min(., na.rm = TRUE))) 

  numerical_max <- Data %>% 
    group_by(hh_gender_farmer) %>%
    select_if(is.numeric) %>%
    summarise_each(funs(round(max(., na.rm = TRUE),2))) 

  numerical_freq <- Data %>% 
    group_by(hh_gender_farmer) %>%
    select_if(is.numeric) %>%
    summarise_each(funs(count_n)) 

  numerical_descriptives <- reshape2::melt(numerical_freq, value.name="n") %>% 
    left_join(melt(numerical_means, value.name="mean")) %>% 
    left_join(melt(numerical_sds, value.name="sd")) %>%
    left_join(melt(numerical_minus, value.name="min")) %>%
    left_join(melt(numerical_max, value.name="max")) %>%
    rename(variableName = variable) %>%
    left_join(survey_questions) %>%
    select("section", "name", "variableName","hh_gender_farmer","n","mean","sd", "min","max") %>%
    rename("gender" = "hh_gender_farmer",
          "question" = "name") %>%
    filter(!is.na(question))

  # if(country %in% c("kenya", "nigeria")){
  #   numerical_descriptives <- numerical_descriptives %>% 
  #     full_join(ppi_var)
  # }

  ## ---- Categorical descriptives ----

  # Gender
  gender_var <- melt(table(Data$hh_gender_farmer))
  gender_var$percentage <- round((gender_var$value/nr_participants_fsize)*100,1)
  names(gender_var) <- c("gender", "count", "percentage")

  ## Education (Male vs Female, primary and secondary)
  education_var <- melt(table(Data[,c("hh_gender_farmer", "hh_education_farmer")]))
  names(education_var) <- c("gender", "answer", "frequency")
  education_var <- education_var %>%
    left_join(gender_var[,c("gender","count")])

  education_var$percentage <- round((education_var$frequency/education_var$count)*100,1)
  education_var$variable <- "hh_education_farmer"
  education_var <- education_var[,c("gender", "variable", "answer", "frequency", "percentage")]

  ## Household head
  household_head_var <- melt(table(Data[,c("hh_gender_farmer", "hh_head_gender")]))
  names(household_head_var) <- c("gender", "answer", "frequency")
  household_head_var <- household_head_var %>%
    left_join(gender_var[,c("gender","count")])

  household_head_var$percentage <- round((household_head_var$frequency/household_head_var$count)*100,1)
  household_head_var$variable <- "hh_head_gender"
  household_head_var <- household_head_var[,c("gender", "variable", "answer", "frequency", "percentage")]

  categorical_descriptives <- household_head_var %>% full_join(education_var)

  ## FOOD SECURITY
  foodshortage_var <- melt(
    table(Data[,c("hh_gender_farmer", "fs_shortage")]),
    value.name="frequency",
    varnames = c("gender","answer"))
  foodshortage_var$variable <- "fs_shortage"

  foodshortage_var <- foodshortage_var %>%
    left_join(gender_var[,c("gender","count")])
  foodshortage_var$percentage <- round((foodshortage_var$frequency/foodshortage_var$count)*100,1)
  foodshortage_var <- foodshortage_var %>% dplyr::select(-count)

  categorical_descriptives <- education_var %>% full_join(foodshortage_var)

  ## FS months
  fs_shortage_months_var <- Data %>% 
    cSplit("fs_shortage_months","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("fs_shortage_months")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  fs_shortage_months_var <- melt(
    table(fs_shortage_months_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  fs_shortage_months_var <- fs_shortage_months_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "fs_shortage_months") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- education_var %>% full_join(fs_shortage_months_var)

  ## MOBILE MONEY
  Data[,c("hh_phone", "hh_phone_functionality", "hh_mobile_money", "hh_bank_account")] <-
    apply(Data[,c("hh_phone", "hh_phone_functionality", "hh_mobile_money", "hh_bank_account")],
          2, as.character)
  mobile_var <- melt(table(Data[,c("hh_gender_farmer", "hh_phone")]),
                    value.name="frequency",
                    varnames = c("gender","answer"))
  money_var <- melt(table(Data[,c("hh_gender_farmer", "hh_mobile_money")]),
                    value.name="frequency",
                    varnames = c("gender","answer"))
  bank_var <- melt(table(Data[,c("hh_gender_farmer", "hh_bank_account")]),
                  value.name="frequency",
                  varnames = c("gender","answer"))

  mobile_var$variable <- "hh_phone"
  money_var$variable <- "hh_mobile_money"
  bank_var$variable <- "hh_bank_account"

  mobile_money_var <- rbind(mobile_var, money_var, bank_var)

  mobile_money_var <- mobile_money_var %>%
    left_join(gender_var[,c("gender", "count")])
  mobile_money_var$percentage <- round(
    (mobile_money_var$frequency/mobile_money_var$count)*100,1)
  mobile_money_var <- mobile_money_var %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage))

  categorical_descriptives <- categorical_descriptives %>% full_join(mobile_money_var)

  ## Mobile functionality
  mobile_function_var <- Data %>% 
    cSplit("hh_phone_functionality","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("hh_phone_functionality")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  mobile_function_var <- melt(
    table(mobile_function_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  mobile_function_var <- mobile_function_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "hh_phone_functionality") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(mobile_function_var)

  ## LOANS

  if(company_type == "FSP"){
    loan_var <- Data %>% 
      cSplit("hh_loan_presence","|") %>%
      dplyr::select(hh_gender_farmer, starts_with("hh_loan_presence")) %>%
      gather(position, answer, -hh_gender_farmer) %>%
      select("hh_gender_farmer", "answer")
    
    loan_var <- melt(
      table(loan_var[,c("hh_gender_farmer", "answer")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    loan_var <- loan_var %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "hh_loan_presence") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage)) 
    
    categorical_descriptives <- categorical_descriptives %>% 
      full_join(loan_var)
  }

  ## Loan Source

  if(company_type == "FSP"){
    loan_source_var <- Data %>% 
      cSplit("hh_loan_source","|") %>%
      dplyr::select(hh_gender_farmer, starts_with("hh_loan_source")) %>%
      gather(position, answer, -hh_gender_farmer) %>%
      select("hh_gender_farmer", "answer")
    
    loan_source_var <- melt(
      table(loan_source_var[,c("hh_gender_farmer", "answer")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    loan_source_var <- loan_source_var %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "hh_loan_source") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage)) 
    
    categorical_descriptives <- categorical_descriptives %>% 
      full_join(loan_source_var)
  }


  ## LOAN USE --

  if(company_type == "FSP"){
    loan_use_var <- Data %>%
      cSplit("hh_loan_use","|") %>%
      dplyr::select(hh_gender_farmer, starts_with("hh_loan_use")) %>%
      gather(position, answer, -hh_gender_farmer) %>%
      select("hh_gender_farmer", "answer")
    
    loan_use_var <- melt(
      table(loan_use_var[,c("hh_gender_farmer", "answer")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    loan_use_var <- loan_use_var %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "hh_loan_use") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage))
    
    categorical_descriptives <- categorical_descriptives %>%
      full_join(loan_use_var)
  }

  ## CASHFLOW presence
  Data$cf_shortage <- as.character(Data$cf_shortage)

  cashflow_var <- melt(table(Data[,c("hh_gender_farmer","cf_shortage")]))
  cashflow_var <- cashflow_var %>% 
    rename(gender=hh_gender_farmer, answer=cf_shortage, frequency=value) %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate(percentage = round((frequency/count)*100,1)) %>%
    mutate(variable = "cf_shortage") %>%
    select(-count)

  categorical_descriptives <- categorical_descriptives %>%
    full_join(cashflow_var)

  ##  CASHFLOW MONTHS
  cashflow_months <- Data %>% 
    cSplit("cf_shortage_months","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("cf_shortage_months")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  cashflow_months <- melt(
    table(cashflow_months[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  cashflow_months <- cashflow_months %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "cf_shortage_months") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) %>%
    filter(answer != "i don't know")

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(cashflow_months)

  # MAIN CROP -> FIRST
  first_crop_var <- Data %>% 
    unite("f_first_crop", c(f_first_crop, f_first_crop_other),
          na.rm = TRUE, remove = FALSE, sep=" ") %>%
    select(hh_gender_farmer, f_first_crop) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  first_crop_var <- melt(
    table(first_crop_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  first_crop_var <- first_crop_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_first_crop") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(first_crop_var)

  # MAIN CROP -> SECOND
  second_crop_var <- Data %>% 
    unite("f_second_crop", c(f_second_crop, f_second_crop_other),na.rm = TRUE, remove = FALSE, sep=" ") %>%
    select(hh_gender_farmer, f_second_crop) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  second_crop_var <- melt(
    table(second_crop_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  second_crop_var <- second_crop_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_second_crop") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) %>%
    mutate(answer = replace(answer, answer=="", "no second crop"))

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(second_crop_var)

  # MAIN CROP -> THIRD
  third_crop_var <- Data %>% 
    unite("f_third_crop", c(f_third_crop, f_third_crop_other), na.rm = TRUE, remove = FALSE, sep=" ") %>%
    select(hh_gender_farmer, f_third_crop) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  third_crop_var <- melt(
    table(third_crop_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  third_crop_var <- third_crop_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_third_crop") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) %>%
    mutate(answer = replace(answer, answer=="", "no third crop"))

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(third_crop_var)

  ## INPUTS
  inputs_var <- Data %>% 
    cSplit("f_inputs_usage","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("f_inputs_usage")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  inputs_var <- melt(
    table(inputs_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  inputs_var <- inputs_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_inputs_usage") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(inputs_var)

  ## INPUTS Challenges
  input_challenges_var <- Data %>% 
    cSplit("f_inputs_challenges_types","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("f_inputs_challenges_types")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  input_challenges_var <- melt(
    table(input_challenges_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  input_challenges_var <- input_challenges_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_inputs_challenges_types") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(input_challenges_var)

  ## EQUIPMENT

  equipment_var <- Data %>% 
    unite("f_equipment_usage", c(f_equipment_usage, f_equipment_other), na.rm = TRUE, remove = FALSE, sep="|") %>%
    cSplit("f_equipment_usage","|") %>% 
    dplyr::select(hh_gender_farmer, starts_with("f_equipment_usage")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  equipment_var <- melt(
    table(equipment_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  equipment_var <- equipment_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_equipment_usage") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(equipment_var)

  ## CLIMATE ISSUES 
  climate_var <- Data %>% 
    cSplit("cl_extreme_weather","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("cl_extreme_weather")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  climate_var <- melt(
    table(climate_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  climate_var <- climate_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "cl_extreme_weather") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(climate_var)

  ## CLIMATE MITIGATION
  mitigation_var <- Data %>% 
    unite("cl_coping_mechanisms", c(cl_coping_mechanisms, `cl_coping_mechanisms_other`), na.rm = TRUE, remove = FALSE, sep="|") %>%
    cSplit("cl_coping_mechanisms","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("cl_coping_mechanisms")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  mitigation_var <- melt(
    table(mitigation_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  mitigation_var <- mitigation_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "cl_coping_mechanisms") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(mitigation_var)

  ## GENDER

  # Preliminaries

  # Informed consent info
  g_informed_consent <- melt(
    table(Data[,c("hh_gender_farmer", "g_informed_consent")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  g_informed_consent <- g_informed_consent %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "g_informed_consent") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage))

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_informed_consent)

  # Education of female primary dec. mak.
  g_education <- melt(
    table(Data[,c("hh_gender_farmer", "g_education")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  g_education <- g_education %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "g_education") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage))

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_education)

  # Decision making in HH
  g_reproductive_var <- Data %>% 
    cSplit("g_reprod_activities","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("g_reprod_activities")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  g_reproductive_var <- melt(
    table(g_reproductive_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  g_reproductive_var <- g_reproductive_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "g_reprod_activities") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_reproductive_var)

  ## DECISION MAKING HH  --> PRODUCTIVE
  g_productive_var <- Data %>% 
    cSplit("g_prod_activities","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("g_prod_activities")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  g_productive_var <- melt(
    table(g_productive_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  g_productive_var <- g_productive_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "g_prod_activities") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_productive_var)

  ## DECISION MAKING ACTIVITIES HH FARM -- Reproductive
  g_reproductive_input <- melt(
    table(Data[,c("hh_gender_farmer", "g_reprod_input_decisions")]),
    value.name="frequency",
    varnames=c("gender","answer"))
  g_reproductive_input$variable <- "g_reprod_input_decisions"

  g_reproductive_input <- g_reproductive_input %>%
    left_join(gender_var[,c("gender","count")])
  g_reproductive_input$percentage <- round(
    (g_reproductive_input$frequency/g_reproductive_input$count)*100,1)
  g_reproductive_input <- g_reproductive_input %>% 
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage))

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_reproductive_input)

  # Decision making reproductive
  g_reproductive_decision <- Data %>% 
    dplyr::select(hh_gender_farmer, "g_reprod_resp_decision") %>%
    cSplit("g_reprod_resp_decision","|") %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  g_reproductive_decision <- melt(
    table(g_reproductive_decision[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  g_reproductive_decision <- g_reproductive_decision %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "g_reprod_resp_decision") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_reproductive_decision)

  ## DECISION MAKING ACTIVITIES HH FARM 
  g_productive_input <- Data %>% 
    dplyr::select(hh_gender_farmer, 
                  starts_with("g_prod_input"), 
                  -contains("household")) %>%
    gather(position, answer, -hh_gender_farmer) #%>%
  # mutate(position = gsub("g_prod_input_", "input into ", position)) %>%
  # mutate(position = gsub('_', " ", position)) 

  g_productive_input <- melt(
    table(g_productive_input),
    value.name="frequency",
    varnames=c("gender","variable","answer"))

  g_productive_input <- g_productive_input %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_productive_input)

  # Decision making productive
  g_productive_decision <- Data %>% 
    dplyr::select(hh_gender_farmer, 
                  starts_with("g_prod_decision")) %>%
    cSplit(2:8,"|") %>%
    gather(position, answer, -hh_gender_farmer) %>%
    # mutate(position = gsub("g_prod_decision_", "decision making ", position)) %>%
    mutate(position = gsub('[0-9]', "", position)) %>%
    mutate(position = gsub('_$', "", position))

  g_productive_decision <- melt(
    table(g_productive_decision),
    value.name="frequency",
    varnames=c("gender", "variable","answer"))

  g_productive_decision <- g_productive_decision %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) %>%
    filter(frequency != 0)

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(g_productive_decision)

  ## CUSTOMER SATISFACTION
  customer_var <- Data %>% 
    cSplit("cs_sdm_company_services","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("cs_sdm_company_services")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  customer_var <- melt(
    table(customer_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  customer_var <- customer_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "cs_sdm_company_services") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(customer_var)

  ## RECOMMENDATIONS 
  recommendations_var <- Data %>% 
    cSplit("cs_recommendation","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("cs_recommendation")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  recommendations_var <- melt(
    table(recommendations_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  recommendations_var <- recommendations_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "cs_recommendation") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(recommendations_var)

  ## LIVESTOCK
  livestock_var <- Data %>% 
    cSplit("f_other_crop_livestock","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("f_other_crop_livestock")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  livestock_var <- melt(
    table(livestock_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  livestock_var <- livestock_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_other_crop_livestock") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(livestock_var)

  ## OFF -FARM INCOME
  off_farm_var <- Data %>% 
    cSplit("f_offfarm_otherincome","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("f_offfarm_otherincome")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  off_farm_var <- melt(
    table(off_farm_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  off_farm_var <- off_farm_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_offfarm_otherincome") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(off_farm_var)

  # LAND OWNERSHIP
  land_ownership_var <- Data %>% 
    cSplit("f_ownership","|") %>%
    dplyr::select(hh_gender_farmer, starts_with("f_ownership")) %>%
    gather(position, answer, -hh_gender_farmer) %>%
    select("hh_gender_farmer", "answer")

  land_ownership_var <- melt(
    table(land_ownership_var[,c("hh_gender_farmer", "answer")]),
    value.name="frequency",
    varnames=c("gender", "answer"))

  land_ownership_var <- land_ownership_var %>%
    left_join(gender_var[,c("gender","count")]) %>%
    mutate_at(vars(c("count", "frequency")), as.numeric) %>%
    mutate(percentage =  round((frequency/count)*100,1)) %>%
    mutate(variable = "f_ownership") %>%
    dplyr::select(-count) %>%
    arrange(gender, desc(percentage)) 

  categorical_descriptives <- categorical_descriptives %>% 
    full_join(land_ownership_var)

  # Food Security addition Rubutco
  if(company_name == "Rubutco"){
    # Stunting
    fs_stunting <- melt(
      table(Data[,c("hh_gender_farmer", "fs_stunting")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    fs_stunting <- fs_stunting %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "fs_stunting") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage))
    
    categorical_descriptives <- categorical_descriptives %>% 
      full_join(fs_stunting)
    
    # Malnutrition
    fs_malnutrition <- melt(
      table(Data[,c("hh_gender_farmer", "fs_malnutrition")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    fs_malnutrition <- fs_malnutrition %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "fs_malnutrition") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage))
    
    categorical_descriptives <- categorical_descriptives %>% 
      full_join(fs_malnutrition)
    
    # Malnutrition family
    fs_family_malnutrition <- melt(
      table(Data[,c("hh_gender_farmer", "fs_family_malnutrition")]),
      value.name="frequency",
      varnames=c("gender", "answer"))
    
    fs_family_malnutrition <- fs_family_malnutrition %>%
      left_join(gender_var[,c("gender","count")]) %>%
      mutate_at(vars(c("count", "frequency")), as.numeric) %>%
      mutate(percentage =  round((frequency/count)*100,1)) %>%
      mutate(variable = "fs_family_malnutrition") %>%
      dplyr::select(-count) %>%
      arrange(gender, desc(percentage))
    
    categorical_descriptives <- categorical_descriptives %>% 
      full_join(fs_family_malnutrition)
  }

  # Add n to categorical descriptives
  cat_desc_n <-categorical_descriptives %>% 
    group_by(gender, variable) %>% 
    summarise(n = sum(frequency))

  categorical_descriptives <- categorical_descriptives %>% 
    left_join(cat_desc_n) %>%
    rename(variableName = variable) %>%
    left_join(survey_questions %>% select(section, name, variableName)) %>%
    select("section", "name", "variableName", "gender", 
          "n", "answer","frequency", "percentage")

  ## ---- write ----

  ## WRITE data to excel
  # sets <- list(
  #   "Code book" = survey_questions,
  #   "Cleaned Data" = Data,
  #   # "Raw Data" = Data_raw,
  #   # "Missing values in the data" = missings_raw,
  #   "Outliers" = outliers,
  #   "Numerical descriptives" = numerical_descriptives,
  #   "Categorical descriptives" = categorical_descriptives
  # )

  ## WRITE data to excel
  sets_anonymized <- list(
    "Code book" = survey_questions,
    "Cleaned Data" = Data,
    "Missing values in the data" = missings_raw,
    "Outliers" = outliers,
    "Numerical descriptives" = numerical_descriptives,
    "Categorical descriptives" = categorical_descriptives
  )

  # write.xlsx(sets_anonymized, file = here::here(paste0(survey_id, ".xlsx")))
  print("Finished")

  # write.xlsx(sets_anonymized, file = here::here("data/output", paste0(anonymized_output_file, ".xlsx")))
  # write.xlsx(sets, file = here::here("data/output", paste0(output_file, ".xlsx")))
}