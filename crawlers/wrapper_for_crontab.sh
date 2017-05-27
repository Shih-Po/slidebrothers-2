cd /root/Projects/slidebrothers-2/
. .venv/bin/activate; cd crawlers/

date
python update_case_ptt_mongodb_collection.py
python update_case_104_mongodb_collection.py
python update_case_518_mongodb_collection.py
