'use strict';

angular.module('bmb.data', [])
    .service('stubData', function stubData() {
        var me = this;

        me.getData = function (config) {
            var data = {};

            data.term = config.term;
            data.selectedFilters = config.filters || [];
            data.results = me.random([
                {
                    'id': '281247D1-4681-8EAB-C4E0-0B10CC9D88D6',
                    'title': 'Sed id risus quis diam luctus lobortis.',
                    'summary': 'id nunc interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget, venenatis a, magna. Lorem'
                },
                {
                    'id': '636A88ED-73A3-D0E1-EB78-3C0B76923202',
                    'title': 'varius. Nam porttitor scelerisque neque. Nullam nisl.',
                    'summary': 'Nam ligula elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut'
                },
                {
                    'id': 'FFA8461E-462C-9E92-4B90-3BB1ADC969A8',
                    'title': 'Mauris quis turpis vitae purus gravida sagittis.',
                    'summary': 'cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer vulputate, risus a ultricies adipiscing, enim mi'
                },
                {
                    'id': '8826ECDE-2446-9153-38CD-1AE8E6B10ED7',
                    'title': 'Aenean eget metus. In nec orci. Donec',
                    'summary': 'dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut odio vel est tempor bibendum. Donec felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla.'
                },
                {
                    'id': 'BA1CDB2C-3589-65D1-CE3F-18F653F23BE5',
                    'title': 'erat. Sed nunc est, mollis non, cursus',
                    'summary': 'dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras'
                },
                {
                    'id': '8E18A57C-EB78-2CD1-FB1B-08F7EFC598AB',
                    'title': 'turpis non enim. Mauris quis turpis vitae',
                    'summary': 'pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam, elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc'
                },
                {
                    'id': 'E394F7D1-5BB9-CD32-6344-7EA95678F959',
                    'title': 'aliquam arcu. Aliquam ultrices iaculis odio. Nam',
                    'summary': 'facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna'
                },
                {
                    'id': 'A6601155-31F3-2CD7-578F-551410CB3F87',
                    'title': 'non, egestas a, dui. Cras pellentesque. Sed',
                    'summary': 'elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum'
                },
                {
                    'id': '5423E4B3-F4FF-C120-E416-412EC7E3C91D',
                    'title': 'interdum feugiat. Sed nec metus facilisis lorem',
                    'summary': 'luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris'
                },
                {
                    'id': 'A0AB1DB5-06BD-8F28-2110-926C9A37DABF',
                    'title': 'iaculis nec, eleifend non, dapibus rutrum, justo.',
                    'summary': 'eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc'
                },
                {
                    'id': '21E8389E-B16C-1056-BEA9-7614A312CFB2',
                    'title': 'molestie sodales. Mauris blandit enim consequat purus.',
                    'summary': 'ac mattis semper, dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim,'
                },
                {
                    'id': '37B31D81-0B88-9310-9EB5-E13BFC75B9F8',
                    'title': 'lacus pede sagittis augue, eu tempor erat',
                    'summary': 'eros non enim commodo hendrerit. Donec porttitor tellus non magna. Nam ligula elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna.'
                },
                {
                    'id': 'FFF50FB2-7306-5E59-8593-D98C29700ABF',
                    'title': 'natoque penatibus et magnis dis parturient montes,',
                    'summary': 'molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque'
                },
                {
                    'id': 'F869935D-9379-97ED-2BF5-6F0EA112E4DF',
                    'title': 'luctus ut, pellentesque eget, dictum placerat, augue.',
                    'summary': 'porttitor vulputate, posuere vulputate, lacus. Cras interdum. Nunc sollicitudin commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper'
                },
                {
                    'id': '322D7ED5-78D0-8E16-7C7C-627FF1086178',
                    'title': 'id enim. Curabitur massa. Vestibulum accumsan neque',
                    'summary': 'sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales.'
                },
                {
                    'id': '6979DB83-DC49-9DA0-1D78-D10B48945255',
                    'title': 'conubia nostra, per inceptos hymenaeos. Mauris ut',
                    'summary': 'a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor quis, tristique ac, eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula. Aliquam erat'
                },
                {
                    'id': '0B96AAB2-A62B-DD08-C71D-FFCB27EC637A',
                    'title': 'ac, feugiat non, lobortis quis, pede. Suspendisse',
                    'summary': 'Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy'
                },
                {
                    'id': '1BEDA2DA-99F8-076C-0E88-7A29D901CA3E',
                    'title': 'risus quis diam luctus lobortis. Class aptent',
                    'summary': 'Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut odio vel est tempor bibendum. Donec felis'
                },
                {
                    'id': 'C71FCAF6-E3F2-5A69-F0CC-C9C99C6B1ED1',
                    'title': 'eu, accumsan sed, facilisis vitae, orci. Phasellus',
                    'summary': 'pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et netus'
                },
                {
                    'id': '2F205723-C2D6-1375-D264-0C1757E1178B',
                    'title': 'posuere at, velit. Cras lorem lorem, luctus',
                    'summary': 'In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit'
                },
                {
                    'id': 'F045D188-9F14-20AA-94DB-14E3356B1B64',
                    'title': 'tellus. Phasellus elit pede, malesuada vel, venenatis',
                    'summary': 'dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras'
                },
                {
                    'id': 'AE514B84-7808-CC57-7E72-C6A66AA71B9C',
                    'title': 'non dui nec urna suscipit nonummy. Fusce',
                    'summary': 'risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus vulputate, nisi sem semper erat, in consectetuer ipsum nunc'
                },
                {
                    'id': '72F0B2EA-FB27-38F8-B29D-611EF6F1CE8E',
                    'title': 'neque et nunc. Quisque ornare tortor at',
                    'summary': 'est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium'
                },
                {
                    'id': 'F8340B50-4AE3-1552-61B0-5D0CAEEC1578',
                    'title': 'neque pellentesque massa lobortis ultrices. Vivamus rhoncus.',
                    'summary': 'nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla.'
                },
                {
                    'id': 'E010756E-361E-1F73-DCF3-1DFB54FDA9FF',
                    'title': 'netus et malesuada fames ac turpis egestas.',
                    'summary': 'ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris'
                },
                {
                    'id': '7E95E724-4B4F-1D68-0F8F-2BD236CA5B28',
                    'title': 'lacus. Quisque purus sapien, gravida non, sollicitudin',
                    'summary': 'eget massa. Suspendisse eleifend. Cras sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris'
                },
                {
                    'id': '0B83CF9B-BB6F-F917-BA44-F19779162D6D',
                    'title': 'a, arcu. Sed et libero. Proin mi.',
                    'summary': 'faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget'
                },
                {
                    'id': 'FD93712F-AFC9-C1B9-C11C-050CFAA48C04',
                    'title': 'vehicula risus. Nulla eget metus eu erat',
                    'summary': 'ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus'
                },
                {
                    'id': '4E6CF188-7C59-8974-ADC1-18B7ECAA270E',
                    'title': 'metus sit amet ante. Vivamus non lorem',
                    'summary': 'eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et'
                },
                {
                    'id': '4A57F24C-85B3-EA1D-6A84-203BD75561C2',
                    'title': 'Sed neque. Sed eget lacus. Mauris non',
                    'summary': 'augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod'
                },
                {
                    'id': '376E87B5-9439-C8AA-C14A-705EF94ABB20',
                    'title': 'amet, consectetuer adipiscing elit. Curabitur sed tortor.',
                    'summary': 'scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae'
                },
                {
                    'id': '1F353C09-820B-B910-BCDC-32EB67CC4839',
                    'title': 'metus urna convallis erat, eget tincidunt dui',
                    'summary': 'mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean eget metus. In nec orci. Donec nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet'
                },
                {
                    'id': 'E987B98C-BCBC-F1F3-15B3-6D8FE70EA64A',
                    'title': 'malesuada vel, convallis in, cursus et, eros.',
                    'summary': 'dignissim pharetra. Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec'
                },
                {
                    'id': 'BCF443F8-2203-53DD-7499-C97016D80876',
                    'title': 'adipiscing. Mauris molestie pharetra nibh. Aliquam ornare,',
                    'summary': 'Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class'
                },
                {
                    'id': '566841ED-26B7-F258-B5CA-01F8CCD4C657',
                    'title': 'sodales nisi magna sed dui. Fusce aliquam,',
                    'summary': 'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies'
                },
                {
                    'id': 'E16FC2B9-7A7B-6EAC-8808-084352F356A9',
                    'title': 'in magna. Phasellus dolor elit, pellentesque a,',
                    'summary': 'tortor. Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna.'
                },
                {
                    'id': '2CC37E85-26B7-9168-6C4A-332E58182238',
                    'title': 'id risus quis diam luctus lobortis. Class',
                    'summary': 'Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus sit amet ante. Vivamus non lorem vitae odio'
                },
                {
                    'id': '4C8440F2-1F38-A6E0-F769-D4FD59AF402D',
                    'title': 'egestas. Aliquam fringilla cursus purus. Nullam scelerisque',
                    'summary': 'luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus.'
                },
                {
                    'id': '27A15611-333D-F8C8-E5A1-603F9007E05F',
                    'title': 'adipiscing non, luctus sit amet, faucibus ut,',
                    'summary': 'Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu.'
                },
                {
                    'id': 'FC77512A-F536-5A50-478B-B6CAA1F36A71',
                    'title': 'fringilla mi lacinia mattis. Integer eu lacus.',
                    'summary': 'blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla.'
                },
                {
                    'id': 'C5BB9990-51CD-FF78-6D39-D98BC517C712',
                    'title': 'quis arcu vel quam dignissim pharetra. Nam',
                    'summary': 'commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit,'
                },
                {
                    'id': 'D31A060A-29EA-35D1-21CB-DE4BAF227938',
                    'title': 'nunc nulla vulputate dui, nec tempus mauris',
                    'summary': 'aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci,'
                },
                {
                    'id': '39841488-768D-A133-6E55-09C6D0670BB4',
                    'title': 'non, lobortis quis, pede. Suspendisse dui. Fusce',
                    'summary': 'cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus sit'
                },
                {
                    'id': '56610D6A-877F-BCD8-009C-25028AB3E336',
                    'title': 'placerat, augue. Sed molestie. Sed id risus',
                    'summary': 'pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus'
                },
                {
                    'id': '16719B74-16A6-A19C-21CF-B2D6FAADAB51',
                    'title': 'arcu iaculis enim, sit amet ornare lectus',
                    'summary': 'faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor'
                },
                {
                    'id': '7100FE63-BFCF-14ED-8DDB-532A60C330CD',
                    'title': 'metus. In lorem. Donec elementum, lorem ut',
                    'summary': 'ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet,'
                },
                {
                    'id': 'F8BC395A-E435-3DA6-8A99-639E1550ACE1',
                    'title': 'neque. Nullam nisl. Maecenas malesuada fringilla est.',
                    'summary': 'malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus.'
                },
                {
                    'id': 'EA1C9DC8-7E8E-A25C-001C-8F5B4DA4C6B1',
                    'title': 'augue scelerisque mollis. Phasellus libero mauris, aliquam',
                    'summary': 'elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec'
                },
                {
                    'id': '3B6EACD7-C451-C977-3D0C-6D7EB0BC8955',
                    'title': 'Sed id risus quis diam luctus lobortis.',
                    'summary': 'neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi'
                },
                {
                    'id': '1C398566-2301-6454-00D4-6F8C96AE6901',
                    'title': 'elit, a feugiat tellus lorem eu metus.',
                    'summary': 'congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit congue. In'
                },
                {
                    'id': '619297FC-D190-A3B7-2FCF-720BC860BF3D',
                    'title': 'quis arcu vel quam dignissim pharetra. Nam',
                    'summary': 'Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer'
                },
                {
                    'id': '02B52D94-F5F1-27BE-F599-B89D41755337',
                    'title': 'et, commodo at, libero. Morbi accumsan laoreet',
                    'summary': 'eu odio tristique pharetra. Quisque ac libero nec ligula consectetuer rhoncus. Nullam velit dui, semper et, lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus.'
                },
                {
                    'id': '6EF425AC-5785-72FF-5BB2-3839505C82E8',
                    'title': 'tellus id nunc interdum feugiat. Sed nec',
                    'summary': 'Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam'
                },
                {
                    'id': '9A1F9D84-1BAB-EF12-574C-C67B6FAC758B',
                    'title': 'tellus id nunc interdum feugiat. Sed nec',
                    'summary': 'eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem'
                },
                {
                    'id': 'A8796072-17D0-4ADC-3BA1-E333B2DE6560',
                    'title': 'sit amet, dapibus id, blandit at, nisi.',
                    'summary': 'Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor.'
                },
                {
                    'id': 'F1166F80-6705-B856-277F-C57B8A65C7EE',
                    'title': 'nec mauris blandit mattis. Cras eget nisi',
                    'summary': 'diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras'
                },
                {
                    'id': '34F959A2-C5E9-7125-E928-928A016FA992',
                    'title': 'massa rutrum magna. Cras convallis convallis dolor.',
                    'summary': 'quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio.'
                },
                {
                    'id': 'DA5FFD55-CB03-DAE8-E3A3-62CF48BDC69A',
                    'title': 'pretium neque. Morbi quis urna. Nunc quis',
                    'summary': 'mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora'
                },
                {
                    'id': 'C36F6B85-6504-DF10-F956-2F9DDDC5CBFB',
                    'title': 'in sodales elit erat vitae risus. Duis',
                    'summary': 'velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor'
                },
                {
                    'id': '601D550E-0164-91A3-C0B9-F3B747289AE0',
                    'title': 'magnis dis parturient montes, nascetur ridiculus mus.',
                    'summary': 'Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis'
                },
                {
                    'id': 'C35F6D4A-D2D7-04DC-EFA3-B946C9704CF7',
                    'title': 'Nam porttitor scelerisque neque. Nullam nisl. Maecenas',
                    'summary': 'leo. Vivamus nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed,'
                },
                {
                    'id': '5CD9ED67-09C1-6522-118F-84436AA2CF25',
                    'title': 'urna. Ut tincidunt vehicula risus. Nulla eget',
                    'summary': 'natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel arcu eu odio tristique pharetra. Quisque ac libero nec ligula consectetuer rhoncus. Nullam velit dui, semper et, lacinia'
                },
                {
                    'id': '91D6E491-54A4-781E-B277-6600905041CD',
                    'title': 'amet risus. Donec egestas. Aliquam nec enim.',
                    'summary': 'Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget, venenatis'
                },
                {
                    'id': '2AA9B585-AD8F-2DB8-7F70-FA7D38F1508F',
                    'title': 'Curae; Donec tincidunt. Donec vitae erat vel',
                    'summary': 'eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros non enim commodo hendrerit. Donec porttitor tellus non'
                },
                {
                    'id': '467F5B2C-AA40-B746-4F36-DBCDB3DF29E9',
                    'title': 'magna. Nam ligula elit, pretium et, rutrum',
                    'summary': 'est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi quis urna. Nunc quis arcu vel quam dignissim'
                },
                {
                    'id': '85E6F38A-CB81-452E-CC49-58205F4F28DB',
                    'title': 'Duis at lacus. Quisque purus sapien, gravida',
                    'summary': 'ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas'
                },
                {
                    'id': 'EB2CDCE6-384C-8FEC-DB67-0ECB6F7907EC',
                    'title': 'Nunc mauris sapien, cursus in, hendrerit consectetuer,',
                    'summary': 'blandit congue. In scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse'
                },
                {
                    'id': '9023FEEB-EB61-EAA7-B5BC-CB96E42AA038',
                    'title': 'erat, eget tincidunt dui augue eu tellus.',
                    'summary': 'posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per'
                },
                {
                    'id': '79CF0E0F-E746-F307-E8AC-CAC786330934',
                    'title': 'fringilla purus mauris a nunc. In at',
                    'summary': 'orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper.'
                },
                {
                    'id': '6795F29B-5A3D-ABE3-5312-40876138C7DE',
                    'title': 'id, libero. Donec consectetuer mauris id sapien.',
                    'summary': 'dui quis accumsan convallis, ante lectus convallis est, vitae sodales nisi magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh sit amet'
                },
                {
                    'id': '467608CA-7990-5882-D4FF-AC18F71A5CE4',
                    'title': 'morbi tristique senectus et netus et malesuada',
                    'summary': 'nonummy. Fusce fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus.'
                },
                {
                    'id': '1DF88777-1BC3-816A-13E6-86F4EB5C01CD',
                    'title': 'mauris sapien, cursus in, hendrerit consectetuer, cursus',
                    'summary': 'lorem ipsum sodales purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est'
                },
                {
                    'id': '2971DAAC-6B8C-00CF-1228-37C1E50648C8',
                    'title': 'Donec consectetuer mauris id sapien. Cras dolor',
                    'summary': 'lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                },
                {
                    'id': '91C6B7B4-1BBC-CE1B-7B5B-F67324B39914',
                    'title': 'eu, placerat eget, venenatis a, magna. Lorem',
                    'summary': 'ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc'
                },
                {
                    'id': '7CE3EC08-CA8F-3337-AD8A-AEDCA411E915',
                    'title': 'lorem, sit amet ultricies sem magna nec',
                    'summary': 'a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis'
                },
                {
                    'id': '7747FA5B-25FF-1973-D4DC-79CE16701CE7',
                    'title': 'vestibulum lorem, sit amet ultricies sem magna',
                    'summary': 'magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam'
                },
                {
                    'id': 'A0C215EC-A731-3778-A396-7C65D8D948DA',
                    'title': 'enim mi tempor lorem, eget mollis lectus',
                    'summary': 'lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos'
                },
                {
                    'id': '6E3D62CE-05C3-48C8-2CDE-699E342C057D',
                    'title': 'malesuada augue ut lacus. Nulla tincidunt, neque',
                    'summary': 'sapien. Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant'
                },
                {
                    'id': '50B91181-C6C3-8D6E-B501-6E1E71C62914',
                    'title': 'sit amet metus. Aliquam erat volutpat. Nulla',
                    'summary': 'nec enim. Nunc ut erat. Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam'
                },
                {
                    'id': '53876E06-B168-E2C9-AD6D-940AF065DD0F',
                    'title': 'eu augue porttitor interdum. Sed auctor odio',
                    'summary': 'placerat velit. Quisque varius. Nam porttitor scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae'
                },
                {
                    'id': '00CE6291-6D03-6FFB-8D74-BC90DE26F484',
                    'title': 'ligula. Donec luctus aliquet odio. Etiam ligula',
                    'summary': 'est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi quis urna. Nunc quis arcu vel quam dignissim'
                },
                {
                    'id': '7A60AC3C-DAE5-99E2-1FC6-D7B6FF6EB77A',
                    'title': 'commodo auctor velit. Aliquam nisl. Nulla eu',
                    'summary': 'ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In'
                },
                {
                    'id': '82B6E4AE-174E-EA66-727A-79D523F7E379',
                    'title': 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
                    'summary': 'est tempor bibendum. Donec felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus. Duis elementum, dui quis'
                },
                {
                    'id': 'B0FF8394-5498-1A07-6CAA-5E1FF45ABB4A',
                    'title': 'vel est tempor bibendum. Donec felis orci,',
                    'summary': 'Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem'
                },
                {
                    'id': 'C0CD06B9-D879-7E00-8A4B-52550E456FA2',
                    'title': 'auctor odio a purus. Duis elementum, dui',
                    'summary': 'diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras'
                },
                {
                    'id': 'CB845740-A7ED-6ADB-7B08-1EB370345AC1',
                    'title': 'neque. Nullam nisl. Maecenas malesuada fringilla est.',
                    'summary': 'tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc sed pede.'
                },
                {
                    'id': '8F924CCC-FD67-0534-47F3-08F805223A43',
                    'title': 'sed dui. Fusce aliquam, enim nec tempus',
                    'summary': 'Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante. Maecenas mi'
                },
                {
                    'id': '461817EA-F44C-DC34-3849-D944E38A5A6D',
                    'title': 'sapien. Nunc pulvinar arcu et pede. Nunc',
                    'summary': 'aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam'
                },
                {
                    'id': '8DAFC4C3-A2B2-B7DA-371E-A2BA767E7204',
                    'title': 'Pellentesque ut ipsum ac mi eleifend egestas.',
                    'summary': 'nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante,'
                },
                {
                    'id': 'F70744DD-C16C-C096-1180-34BC9C196E0B',
                    'title': 'dolor. Fusce mi lorem, vehicula et, rutrum',
                    'summary': 'varius. Nam porttitor scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna'
                },
                {
                    'id': '6656405F-14DB-1966-BE4B-BE47A7FC53EB',
                    'title': 'laoreet lectus quis massa. Mauris vestibulum, neque',
                    'summary': 'adipiscing lobortis risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget lacus. Mauris non dui nec urna'
                },
                {
                    'id': '2E2FA2DB-EFFB-1DC4-CB10-B62832864985',
                    'title': 'Nullam nisl. Maecenas malesuada fringilla est. Mauris',
                    'summary': 'Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec enim. Nunc ut erat. Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed'
                },
                {
                    'id': 'C9E85168-8383-C37B-115D-3C59B2401424',
                    'title': 'gravida nunc sed pede. Cum sociis natoque',
                    'summary': 'amet luctus vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor'
                },
                {
                    'id': '7E572866-6FD3-1AC0-F00F-236B5BABC5BC',
                    'title': 'ligula eu enim. Etiam imperdiet dictum magna.',
                    'summary': 'natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec'
                },
                {
                    'id': '4DE0979D-DCFC-05A8-2CC0-391153CCD09A',
                    'title': 'at risus. Nunc ac sem ut dolor',
                    'summary': 'lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur'
                },
                {
                    'id': '155E1086-4F3B-A4A8-B1BA-43F9CA22D771',
                    'title': 'ut lacus. Nulla tincidunt, neque vitae semper',
                    'summary': 'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque.'
                },
                {
                    'id': '01FEE797-CA1D-8209-52E1-F9BC4FEFA2B9',
                    'title': 'sit amet, consectetuer adipiscing elit. Aliquam auctor,',
                    'summary': 'semper cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean eget metus. In nec orci. Donec nibh. Quisque nonummy ipsum non arcu.'
                },
                {
                    'id': '4A95AF67-F463-9D26-9469-283F065B57D0',
                    'title': 'sit amet metus. Aliquam erat volutpat. Nulla',
                    'summary': 'arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis'
                },
                {
                    'id': '501CCBB5-D23B-ECAE-CEFE-40D71DED84B1',
                    'title': 'eu tellus. Phasellus elit pede, malesuada vel,',
                    'summary': 'nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum convallis'
                },
                {
                    'id': 'B841786D-0597-2433-D3A0-A07C5F4BAEBB',
                    'title': 'tempor augue ac ipsum. Phasellus vitae mauris',
                    'summary': 'ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget lacus. Mauris non dui nec urna suscipit nonummy. Fusce fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus'
                }
            ]);
            data.filters = me.applyFilters([
                {
                    'id': '2C636887-8130-37BA-9825-1EDF4D2C8E23',
                    'name': 'Sed eu eros.',
                    'count': 13
                },
                {
                    'id': '40727D4A-0CFE-717D-90DB-DE109B2FD3AB',
                    'name': 'dui, in sodales',
                    'count': 14
                },
                {
                    'id': 'B86F94B5-9DC6-55E3-7C49-7B0620FFA976',
                    'name': 'quis, pede. Praesent',
                    'count': 7
                },
                {
                    'id': '72B082B6-E9B2-3435-6375-CD9D299E1A52',
                    'name': 'dui nec urna',
                    'count': 15
                },
                {
                    'id': '2D6F5F2B-A012-AEE9-0E18-2B0436DAD318',
                    'name': 'feugiat placerat velit.',
                    'count': 2
                },
                {
                    'id': '462C762E-36B0-4616-6F14-6F184D4D4EA6',
                    'name': 'ultricies sem magna',
                    'count': 6
                },
                {
                    'id': '62A725D0-38EF-A4F0-87C6-D940C1152DCA',
                    'name': 'ut ipsum ac',
                    'count': 19
                },
                {
                    'id': 'B2D96562-0FE5-3873-C04F-1D5117537228',
                    'name': 'scelerisque neque. Nullam',
                    'count': 17
                },
                {
                    'id': '8EA1FF87-C6D9-EA0D-A8E9-41AEB18E7347',
                    'name': 'lacus. Mauris non',
                    'count': 18
                },
                {
                    'id': '2F85E616-1577-2F65-4E78-EFB2EF3A0B6F',
                    'name': 'ut cursus luctus,',
                    'count': 5
                },
                {
                    'id': 'AD54EAE3-FD74-E665-C285-698F86EB93EF',
                    'name': 'magna et ipsum',
                    'count': 6
                },
                {
                    'id': 'C2F572E3-FE10-496D-A019-77EA4DF886E2',
                    'name': 'nulla magna, malesuada',
                    'count': 16
                },
                {
                    'id': '296B9E9B-97AB-EF13-F3BD-BD344F52AE09',
                    'name': 'Fusce aliquet magna',
                    'count': 14
                },
                {
                    'id': '18997C10-3A3D-3B31-039F-95573F7EC94E',
                    'name': 'iaculis enim, sit',
                    'count': 6
                },
                {
                    'id': '4D0815EB-C17C-F767-FCE7-561BFC6D4556',
                    'name': 'vitae diam. Proin',
                    'count': 4
                },
                {
                    'id': '1D2EFB78-54AE-306A-2B9E-9E12E017C432',
                    'name': 'primis in faucibus',
                    'count': 7
                },
                {
                    'id': '69925B56-85F6-289F-BDF4-A67692A2512B',
                    'name': 'Fusce fermentum fermentum',
                    'count': 11
                },
                {
                    'id': 'DFCAB11E-99E8-77FF-A7F7-58C6910DE00B',
                    'name': 'et tristique pellentesque,',
                    'count': 13
                },
                {
                    'id': '28B44ABF-19C1-9B4D-6C1D-647B1D8549FD',
                    'name': 'lectus pede et',
                    'count': 9
                },
                {
                    'id': 'EB137716-93D9-E05A-9F0B-6729043C4645',
                    'name': 'Aliquam adipiscing lobortis',
                    'count': 5
                }
            ], data.selectedFilters);

            return data;
        };

        me.applyFilters = function (filters, selectedFilters) {
            if (selectedFilters.length === 0) {
                return filters;
            }

            if (!_.isArray(selectedFilters))
                selectedFilters = [selectedFilters];

            var foundFilters = _.filter(filters, function (filter) {
                return _.contains(selectedFilters, filter.id);
            });

            _.each(foundFilters, function (filter) {
                filter.selected = true;
            });

            return filters;
        }

        me.random = function (list) {
            return _.sample(list, _.random(0, list.length));
        }
    });
