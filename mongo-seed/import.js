const fs = require("fs");

const dbName = "food_eiland";
const db = db.getSiblingDB(dbName);

if (db.getCollection("users").countDocuments() > 0) {
  print("⚠️ Database already contains data. Skipping seed.");
  quit();
}

function ejsonReviver(key, value) {
  if (value && typeof value === "object") {
    if (value.$oid) {
      return ObjectId(value.$oid);
    }
    if (value.$date) {
      return new Date(value.$date);
    }
  }
  return value;
}

function seedCollection(collectionName, fileName) {
  try {
    const filePath = `/docker-entrypoint-initdb.d/${fileName}`;

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");

      const docs = JSON.parse(data, ejsonReviver);

      if (docs.length > 0) {
        db.createCollection(collectionName);
        db.getCollection(collectionName).insertMany(docs);
        print(`✅ Imported ${docs.length} documents into ${collectionName}`);
      }
    } else {
      print(`❌ File not found: ${fileName}`);
    }
  } catch (err) {
    print(`❌ Error importing ${collectionName}: ${err.message}`);
  }
}

print(`🚀 Starting Database Seed for ${dbName}...`);

seedCollection("users", "food_eiland.admins.json");
seedCollection("categories", "food_eiland.categories.json");
seedCollection("recipes", "food_eiland.recipes.json");

print("🎉 Database seeding completed!");
